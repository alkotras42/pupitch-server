import { ApolloDriver } from '@nestjs/apollo'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { GraphQLModule } from '@nestjs/graphql'

import { AccountModule } from '../modules/auth/account/account.module'
import { DeactivateModule } from '../modules/auth/deactivate/deactivate.module'
import { PasswordRecoveryModule } from '../modules/auth/password-recovery/password-recovery.module'
import { ProfileModule } from '../modules/auth/profile/profile.module'
import { SessionModule } from '../modules/auth/session/session.module'
import { TotpModule } from '../modules/auth/totp/totp.module'
import { VerificationModule } from '../modules/auth/verification/verification.module'
import { CronModule } from '../modules/cron/cron.module'
import { LivekitModule } from '../modules/libs/livekit/livekit.module'
import { MailModule } from '../modules/libs/mail/mail.module'
import { StorageModule } from '../modules/libs/storage/storage.module'
import { IngressModule } from '../modules/stream/ingress/ingress.module'
import { StreamModule } from '../modules/stream/stream.module'
import { WebhookModule } from '../modules/webhook/webhook.module'
import { IS_DEV_ENV } from '../shared/utils/is-dev.util'

import { getGraphQLConfig } from './config/graphql.config'
import { getLivekitConfig } from './config/livekit.config'
import { PrismaModule } from './prisma/prisma.module'
import { RedisModule } from './redis/redis.module'
import { CategoryModule } from '../modules/category/category.module'

@Module({
	imports: [
		ConfigModule.forRoot({
			ignoreEnvFile: !IS_DEV_ENV,
			isGlobal: true
		}),
		GraphQLModule.forRootAsync({
			driver: ApolloDriver,
			useFactory: getGraphQLConfig,
			imports: [ConfigModule],
			inject: [ConfigService]
		}),
		LivekitModule.registerAsync({
			useFactory: getLivekitConfig,
			imports: [ConfigModule],
			inject: [ConfigService]
		}),
		PrismaModule,
		RedisModule,
		AccountModule,
		SessionModule,
		MailModule,
		VerificationModule,
		PasswordRecoveryModule,
		TotpModule,
		DeactivateModule,
		CronModule,
		StorageModule,
		ProfileModule,
		StreamModule,
		IngressModule,
		WebhookModule,
		CategoryModule,
	]
})
export class CoreModule {}
