import { Args, Mutation, Resolver } from '@nestjs/graphql'
import type { IngressInput } from 'livekit-server-sdk'

import type { User } from '@/prisma/generated'
import { Authorization } from '@/src/shared/decorators/auth.decorator'
import { authorized } from '@/src/shared/decorators/authorized.decorator'

import { IngressService } from './ingress.service'

@Resolver('Ingress')
export class IngressResolver {
	constructor(private readonly ingressService: IngressService) {}

	@Authorization()
	@Mutation(() => Boolean, { name: 'createIngress' })
	async create(
		@authorized() user: User,
		@Args('ingressType') ingressType: IngressInput
	) {
		return await this.ingressService.create(user, ingressType)
	}
}
