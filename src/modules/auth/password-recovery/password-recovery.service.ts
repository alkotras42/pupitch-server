import {
	BadRequestException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { hash } from 'argon2'
import { Request } from 'express'

import { TokenType } from '@/prisma/generated'
import { PrismaService } from '@/src/core/prisma/prisma.service'
import { generateToken } from '@/src/shared/utils/generate-token.util'
import { getSessionMetadata } from '@/src/shared/utils/session-metadata.util'

import { MailService } from '../../libs/mail/mail.service'

import { NewPasswordInput } from './inputs/new-password.input'
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

	async newPassword(input: NewPasswordInput) {
		const { password, token } = input

		const existingToken = await this.prismaService.token.findUnique({
			where: {
				token,
				type: TokenType.PASSWORD_RESET
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
				password: await hash(password)
			}
		})

		await this.prismaService.token.delete({
			where: {
				id: existingToken.id,
				type: TokenType.PASSWORD_RESET
			}
		})

		return true
	}
}
