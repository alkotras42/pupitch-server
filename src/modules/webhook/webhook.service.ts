import { Injectable } from '@nestjs/common'

import { PrismaService } from '@/src/core/prisma/prisma.service'

import { LivekitService } from '../libs/livekit/livekit.service'

@Injectable()
export class WebhookService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly livekitService: LivekitService
	) {}

	async receiveWebhookLivekit(body: string, authorization: string) {
		const event = await this.livekitService.webhook.receive(
			body,
			authorization,
			true
		)

		console.log(event)

		const isLive = event.event === 'ingress_started'

		await this.prismaService.stream.update({
			where: {
				ingressId: event.ingressInfo.ingressId
			},
			data: {
				isLive
			}
		})
	}
}
