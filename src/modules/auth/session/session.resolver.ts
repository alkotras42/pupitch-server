import { Args, Context, Mutation, Resolver } from '@nestjs/graphql'
import { Query } from '@nestjs/graphql'

import { Authorization } from '@/src/shared/decorators/auth.decorator'
import { UserAgent } from '@/src/shared/decorators/user-agent.decorator'
import type { GqlContext } from '@/src/shared/types/gql-context.types'

import { AuthModel } from '../account/models/auth.model'
import { UserModel } from '../account/models/user.model'

import { LoginInput } from './inputs/login.input'
import { SessionModel } from './models/session.model'
import { SessionService } from './session.service'

@Resolver('Session')
export class SessionResolver {
	constructor(private readonly sessionService: SessionService) {}

	@Authorization()
	@Query(() => [SessionModel], { name: 'findSessionsByUser' })
	async findByUser(@Context() { req }: GqlContext) {
		return this.sessionService.findByUser(req)
	}

	@Authorization()
	@Query(() => SessionModel, { name: 'findCurrentSessions' })
	async findCurrent(@Context() { req }: GqlContext) {
		return this.sessionService.findCurrent(req)
	}

	@Mutation(() => AuthModel, { name: 'loginUser' })
	async login(
		@Context() { req }: GqlContext,
		@Args('data') input: LoginInput,
		@UserAgent() userAgent: string
	) {
		return this.sessionService.login(req, input, userAgent)
	}

	@Authorization()
	@Mutation(() => Boolean, { name: 'logoutUser' })
	async logout(@Context() { req }: GqlContext) {
		return this.sessionService.logout(req)
	}

	@Mutation(() => Boolean, { name: 'clearessionCookie' })
	async clearSessions(@Context() { req }: GqlContext) {
		return this.sessionService.clearSession(req)
	}

	@Authorization()
	@Mutation(() => Boolean, { name: 'removeSession' })
	async removeSession(
		@Context() { req }: GqlContext,
		@Args('sessionId') sessionId: string
	) {
		return this.sessionService.remove(req, sessionId)
	}
}
