import { ConfigService } from '@nestjs/config'

import { TypeLivekitOptions } from '@/src/modules/libs/livekit/types/livekit.types'

export function getLivekitConfig(
	configService: ConfigService
): TypeLivekitOptions {
	return {
		apiKey: configService.getOrThrow<string>('LIVEKIT_API_KEY'),
		apiSecret: configService.getOrThrow<string>('LIVEKIT_API_SECRET'),
		apiUrl: configService.getOrThrow<string>('LIVEKIT_API_URL')
	}
}
