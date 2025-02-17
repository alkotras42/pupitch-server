import { Args, Context, Mutation, Resolver } from '@nestjs/graphql'

import type { User } from '@/prisma/generated'
import { Authorization } from '@/src/shared/decorators/auth.decorator'
import { authorized } from '@/src/shared/decorators/authorized.decorator'
import { UserAgent } from '@/src/shared/decorators/user-agent.decorator'
import { GqlContext } from '@/src/shared/types/gql-context.types'

import { AuthModel } from '../account/models/auth.model'

import { DeactivateService } from './deactivate.service'
import { DeactivateAccountInput } from './inputs/deactivate-account.input'

@Resolver('Deactivate')
export class DeactivateResolver {
	constructor(private readonly deactivateService: DeactivateService) {}

	@Mutation(() => AuthModel, { name: 'deactivateAccount' })
	@Authorization()
	async deactivate(
		@Context() { req }: GqlContext,
		@Args('input') input: DeactivateAccountInput,
		@authorized() user: User,
		@UserAgent() userAgent: string
	) {
		return this.deactivateService.deactivate(req, input, user, userAgent)
	}
}
