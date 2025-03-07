import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

import { User } from '@/prisma/generated'
import { Authorization } from '@/src/shared/decorators/auth.decorator'
import { authorized } from '@/src/shared/decorators/authorized.decorator'

import { AccountService } from './account.service'
import { ChangeEmailInput } from './inputs/change-email.input'
import { ChangePasswordInput } from './inputs/change-password.input'
import { CreateUserInput } from './inputs/create-user.input'
import { UserModel } from './models/user.model'

@Resolver('Account')
export class AccountResolver {
	public constructor(private readonly accountService: AccountService) {}

	@Authorization()
	@Query(() => UserModel, {
		name: 'findMe'
	})
	public async me(@authorized('id') id: string) {
		return this.accountService.me(id)
	}

	@Mutation(() => Boolean, {
		name: 'createUser'
	})
	public async create(@Args('data') input: CreateUserInput) {
		return this.accountService.create(input)
	}

	@Authorization()
	@Mutation(() => Boolean, {
		name: 'changeEmail'
	})
	public async changeEmail(
		@authorized() user: User,
		@Args('input') input: ChangeEmailInput
	) {
		return this.accountService.changeEmail(user, input)
	}

	@Authorization()
	@Mutation(() => Boolean, {
		name: 'changePassword'
	})
	public async changePassword(
		@authorized() user: User,
		@Args('input') input: ChangePasswordInput
	) {
		return this.accountService.changePassword(user, input)
	}
}
