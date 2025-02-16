import { Injectable, NotFoundException } from '@nestjs/common'
import { Request } from 'express'

import { TokenType } from '@/prisma/generated'
import { PrismaService } from '@/src/core/prisma/prisma.service'
import { generateToken } from '@/src/shared/utils/generate-token.util'
import { getSessionMetadata } from '@/src/shared/utils/session-metadata.util'

import { MailService } from '../../libs/mail/mail.service'

import { ResetPasswordInput } from './inputs/reset-password.input'

@Injectable()
export class PasswordRecoveryService {
	public constructor(
		private readonly prismaService: PrismaService,
		private readonly mailService: MailService
	) {}

	async resetPassword(
		req: Request,
		input: ResetPasswordInput,
		userAgent: string
	) {
		const user = await this.prismaService.user.findUnique({
			where: {
				email: input.email
			}
		})
		if (!user) {
			throw new NotFoundException('User not found')
		}

		const passwordResetToken = await generateToken(
			this.prismaService,
			user,
			TokenType.PASSWORD_RESET
		)

		const metadata = getSessionMetadata(req, userAgent)

		await this.mailService.sendPasswordRecoveryToken(
			user.email,
			passwordResetToken.token,
			metadata
		)

		return true
	}
}
