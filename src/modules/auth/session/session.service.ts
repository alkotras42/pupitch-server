import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
	UnauthorizedException
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { verify } from 'argon2'
import { type Request } from 'express'
import { TOTP } from 'otpauth'

import { PrismaService } from '@/src/core/prisma/prisma.service'
import { RedisService } from '@/src/core/redis/redis.service'
import { getSessionMetadata } from '@/src/shared/utils/session-metadata.util'
import { destroySession, saveSession } from '@/src/shared/utils/session.util'

import { VerificationService } from '../verification/verification.service'

import { LoginInput } from './inputs/login.input'

@Injectable()
export class SessionService {
	public constructor(
		private readonly prismaService: PrismaService,
		private readonly redisService: RedisService,
		private readonly configService: ConfigService,
		private readonly verificationService: VerificationService
	) {}

	/**
	 * Retrieves the user's active sessions from the Redis store.
	 *
	 * @param req - The Express request object, used to access the user's session data.
	 * @returns An array of the user's active sessions, sorted by creation date in descending order.
	 * @throws `InternalServerErrorException` If the user's session data cannot be retrieved.
	 */
	async findByUser(req: Request) {
		const userId = req.session.userId

		if (!userId) {
			throw new InternalServerErrorException('User not found')
		}

		const keys = await this.redisService.keys('*')

		const userSessions = []

		for (const key of keys) {
			const sessionData = await this.redisService.get(key)

			if (sessionData) {
				const session = JSON.parse(sessionData)
				if (session.userId === userId) {
					userSessions.push({
						...session,
						id: key.split(':')[1]
					})
				}
			}
		}

		userSessions.sort((a, b) => b.createdAt - a.createdAt)

		return userSessions.filter(session => session.id !== req.session.id)
	}

	async findCurrent(req: Request) {
		const sessionId = req.session.id

		const sessionData = await this.redisService.get(
			`${this.configService.getOrThrow<string>('SESSION_FOLDER')}${sessionId}`
		)

		const session = JSON.parse(sessionData)

		return {
			...session,
			id: sessionId
		}
	}

	async login(req: Request, loginInput: LoginInput, userAgent: string) {
		const { login, password, pin } = loginInput
		const user = await this.prismaService.user.findFirst({
			where: {
				OR: [
					{
						username: { equals: login }
					},
					{
						email: { equals: login }
					}
				]
			}
		})
		if (!user) {
			throw new NotFoundException('User not found')
		}
		const isValidPassword = await verify(user.password, password)

		if (!isValidPassword) {
			throw new UnauthorizedException('Invalid password')
		}

		if (!user.isEmailVerified) {
			await this.verificationService.sendVerificationToken(user)

			throw new BadRequestException(
				'Email not verified. Please check your email for a verification link.'
			)
		}

		if (user.isTotpEnabled) {
			if (!pin) {
				return {
					message: 'Please enter your TOTP code'
				}
			}
			const totp = new TOTP({
				issuer: 'Pupitch',
				label: `${user.email}`,
				algorithm: 'SHA1',
				digits: 6,
				secret: user.totpSecret
			})

			const delta = totp.validate({
				token: pin
			})

			if (delta === null) {
				throw new BadRequestException('Invalid PIN')
			}
		}

		const sessionMetadata = getSessionMetadata(req, userAgent)

		return saveSession(req, user, sessionMetadata)
	}

	async logout(req: Request) {
		return destroySession(req, this.configService)
	}

	async clearSession(req: Request) {
		req.res.clearCookie(
			this.configService.getOrThrow<string>('SESSION_NAME')
		)

		return true
	}

	async remove(req: Request, sessionId: string) {
		if (req.session.id === sessionId) {
			throw new InternalServerErrorException(
				'Cannot remove current session'
			)
		}
		await this.redisService.del(
			`${this.configService.getOrThrow<string>('SESSION_FOLDER')}${sessionId}`
		)

		return true
	}
}
