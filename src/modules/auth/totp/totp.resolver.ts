import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

import { User } from '@/prisma/generated'
import { Authorization } from '@/src/shared/decorators/auth.decorator'
import { authorized } from '@/src/shared/decorators/authorized.decorator'

import { EnableTotpInput } from './inputs/enable-totp.input'
import { TotpModel } from './models/totp.model'
import { TotpService } from './totp.service'

@Resolver('Totp')
export class TotpResolver {
	constructor(private readonly totpService: TotpService) {}

	@Authorization()
	@Query(() => TotpModel, { name: 'generateTotpSecret' })
	generate(@authorized() user: User) {
		return this.totpService.generate(user)
	}

	@Authorization()
	@Mutation(() => Boolean, { name: 'enableTotp' })
	enable(@authorized() user: User, @Args('data') input: EnableTotpInput) {
		return this.totpService.enable(user, input)
	}

	@Authorization()
	@Mutation(() => Boolean, { name: 'disableTotp' })
	disable(@authorized() user: User) {
		return this.totpService.disable(user)
	}
}
