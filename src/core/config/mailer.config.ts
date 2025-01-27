import { MailerOptions } from '@nestjs-modules/mailer'
import { ApolloDriverConfig } from '@nestjs/apollo'
import { ConfigService } from '@nestjs/config'
import { join } from 'path'

import { isDev } from '@/src/shared/utils/is-dev.util'

export function getMailerConfig(configSevice: ConfigService): MailerOptions {
	return {
		transport: {
			host: configSevice.getOrThrow<string>('MAILER_HOST'),
			port: configSevice.getOrThrow<number>('MAILER_PORT'),
			secure: false,
			auth: {
				user: configSevice.getOrThrow<string>('MAILER_LOGIN'),
				pass: configSevice.getOrThrow<string>('MAILER_PASSWORD')
			}
		},
		defaults: {
			from: `"Pupitch" <${configSevice.getOrThrow<string>('MAILER_LOGIN')}>`
		}
	}
}
