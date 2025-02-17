import { MailerService } from '@nestjs-modules/mailer'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { render } from '@react-email/components'
import { Session } from 'inspector'

import { SessionMetadata } from '@/src/shared/types/session-metadata.types'

import { DeactivateTemplate } from './templates/deactivate.template'
import { PasswordRecoveryTemplate } from './templates/password-recovery.template'
import { VerificationTemplate } from './templates/verification.template'

@Injectable()
export class MailService {
	constructor(
		private readonly mailerService: MailerService,
		private readonly configService: ConfigService
	) {}

	async sendVerificationToken(email: string, token: string) {
		const domain = this.configService.getOrThrow<string>('ALLOWED_ORIGINS')

		const html = await render(VerificationTemplate({ domain, token }))

		return this.sendMail(email, 'Verify your email', html)
	}

	async sendPasswordRecoveryToken(
		email: string,
		token: string,
		metadata: SessionMetadata
	) {
		const domain = this.configService.getOrThrow<string>('ALLOWED_ORIGINS')

		const html = await render(
			PasswordRecoveryTemplate({ domain, token, metadata })
		)

		return this.sendMail(email, 'Password recovery', html)
	}

	private sendMail(email: string, subject: string, html: string) {
		return this.mailerService.sendMail({
			to: email,
			subject,
			html
		})
	}

	async sendDeactivateToken(
		email: string,
		token: string,
		metadata: SessionMetadata
	) {
		const html = await render(DeactivateTemplate({ token, metadata }))

		return this.sendMail(email, 'Account deactivation', html)
	}
}
