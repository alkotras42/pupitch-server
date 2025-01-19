import { Args, Context, Mutation, Resolver } from '@nestjs/graphql'

import { UserAgent } from '@/src/shared/decorators/user-agent.decorator'
import type { GqlContext } from '@/src/shared/types/gql-context.types'

import { UserModel } from '../account/models/user.model'

import { LoginInput } from './inputs/login.input'
import { SessionService } from './session.service'

@Resolver('Session')
export class SessionResolver {
	constructor(private readonly sessionService: SessionService) {}

	@Mutation(() => UserModel, { name: 'loginUser' })
	async login(
		@Context() { req }: GqlContext,
		@Args('data') input: LoginInput,
		@UserAgent() userAgent: string
	) {
		return this.sessionService.login(req, input, userAgent)
	}

	@Mutation(() => Boolean, { name: 'logoutUser' })
	async logout(@Context() { req }: GqlContext) {
		return this.sessionService.logout(req)
	}
}
