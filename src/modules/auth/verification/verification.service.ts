import {
	BadRequestException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { Request } from 'express'

import { TokenType, User } from '@/prisma/generated'
import { PrismaService } from '@/src/core/prisma/prisma.service'
import { generateToken } from '@/src/shared/utils/generate-token.util'
import { getSessionMetadata } from '@/src/shared/utils/session-metadata.util'
import { saveSession } from '@/src/shared/utils/session.util'

import { MailService } from '../../libs/mail/mail.service'

import { VerificationInput } from './inputs/verification.input'

@Injectable()
export class VerificationService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly mail: MailService
	) {}

	async verify(req: Request, input: VerificationInput, userAgent: string) {
		const { token } = input

		const existingToken = await this.prisma.token.findUnique({
			where: {
				token,
				type: TokenType.EMAIL_VERIFY
			}
		})

		if (!existingToken) {
			throw new NotFoundException('Token not found')
		}

		const hasExpired = new Date(existingToken.expiresIn) < new Date()

		if (hasExpired) {
			throw new BadRequestException('Token has expired')
		}

		const user = await this.prisma.user.update({
			where: {
				id: existingToken.userId
			},
			data: {
				isEmailVerified: true
			}
		})

		await this.prisma.token.delete({
			where: {
				id: existingToken.id,
				type: TokenType.EMAIL_VERIFY
			}
		})

		const metadata = getSessionMetadata(req, userAgent)

		return saveSession(req, user, metadata)
	}

	async sendVerificationToken(user: User) {
		const verificationToken = await generateToken(
			this.prisma,
			user,
			TokenType.EMAIL_VERIFY,
			true
		)

		await this.mail.sendVerificationToken(
			user.email,
			verificationToken.token
		)

		return true
	}
}
