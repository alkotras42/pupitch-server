import { ConfigService } from '@nestjs/config'
import * as dotend from 'dotenv'

dotend.config()

export function isDev(configService: ConfigService) {
	return configService.getOrThrow<string>('NODE_ENV') === 'development'
}

export const IS_DEV_ENV = process.env.NODE_ENV === 'development'
