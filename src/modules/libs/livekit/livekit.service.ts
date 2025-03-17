import { Inject, Injectable } from '@nestjs/common'
import {
	IngressClient,
	RoomServiceClient,
	WebhookReceiver
} from 'livekit-server-sdk'

import { LivekitOptionsSymbol, TypeLivekitOptions } from './types/livekit.types'

@Injectable()
export class LivekitService {
	private roomService: RoomServiceClient
	private ingressClient: IngressClient
	private webhookReceiver: WebhookReceiver

	public constructor(
		@Inject(LivekitOptionsSymbol)
		private readonly options: TypeLivekitOptions
	) {
		this.roomService = new RoomServiceClient(
			this.options.apiUrl,
			this.options.apiKey,
			this.options.apiSecret
		)

		this.ingressClient = new IngressClient(this.options.apiUrl)

		this.webhookReceiver = new WebhookReceiver(
			this.options.apiKey,
			this.options.apiSecret
		)
	}

	public get ingess(): IngressClient {
		return this.createProxy(this.ingressClient)
	}

	public get room(): RoomServiceClient {
		return this.createProxy(this.roomService)
	}

	public get webhook(): WebhookReceiver {
		return this.createProxy(this.webhookReceiver)
	}

	/**
	 * Creates a proxy for the given target object that automatically binds method calls
	 * and preserves the original object's properties.
	 *
	 * @template T The type of the target object
	 * @param target The object to create a proxy for
	 * @returns A proxied version of the target object with methods bound to their original context
	 */
	private createProxy<T extends object>(target: T) {
		return new Proxy(target, {
			get: (obj, prop) => {
				const value = obj[prop as keyof T]

				if (typeof value === 'function') {
					return value.bind(obj)
				}

				return value
			}
		})
	}
}
