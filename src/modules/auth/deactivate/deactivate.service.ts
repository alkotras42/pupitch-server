import {
	BadRequestException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { verify } from 'argon2'
import { Request } from 'express'

import { TokenType, User } from '@/prisma/generated'
import { PrismaService } from '@/src/core/prisma/prisma.service'
import { generateToken } from '@/src/shared/utils/generate-token.util'
import { getSessionMetadata } from '@/src/shared/utils/session-metadata.util'
import { destroySession } from '@/src/shared/utils/session.util'

import { MailService } from '../../libs/mail/mail.service'

import { DeactivateAccountInput } from './inputs/deactivate-account.input'

@Injectable()
export class DeactivateService {
	public constructor(
		private readonly prismaService: PrismaService,
		private readonly mailService: MailService,
		private readonly configService: ConfigService
	) {}

	private async validateDeactivateToken(req: Request, token: string) {
		const existingToken = await this.prismaService.token.findUnique({
			where: {
				token,
				type: TokenType.DEACTIVATE_ACCOUNT
			}
		})

		if (!existingToken) {
			throw new NotFoundException('Token not found')
		}

		const hasExpired = new Date(existingToken.expiresIn) < new Date()

		if (hasExpired) {
			throw new BadRequestException('Token has expired')
		}

		await this.prismaService.user.update({
			where: {
				id: existingToken.userId
			},
			data: {
				isDeactivated: true,
				deactivatedAt: new Date()
			}
		})

		await this.prismaService.token.delete({
			where: {
				id: existingToken.id,
				type: TokenType.DEACTIVATE_ACCOUNT
			}
		})

		return destroySession(req, this.configService)
	}

	async sendDeactivateToken(req: Request, user: User, userAgent: string) {
		const deactivateToken = await generateToken(
			this.prismaService,
			user,
			TokenType.DEACTIVATE_ACCOUNT,
			false
		)

		const metadata = getSessionMetadata(req, userAgent)

		await this.mailService.sendDeactivateToken(
			user.email,
			deactivateToken.token,
			metadata
		)

		return true
	}

	async deactivate(
		req: Request,
		input: DeactivateAccountInput,
		user: User,
		userAgent: string
	) {
		const { email, password, pin } = input

		if (user.email !== email) {
			throw new BadRequestException('Email is incorrect')
		}
		const isPasswordValid = await verify(user.password, password)

		if (!isPasswordValid) {
			throw new BadRequestException('Password is incorrect')
		}

		if (!pin) {
			await this.sendDeactivateToken(req, user, userAgent)
			return {
				message: 'Please check your email for a deactivation token'
			}
		}

		await this.validateDeactivateToken(req, pin)

		return { user }
	}
}
