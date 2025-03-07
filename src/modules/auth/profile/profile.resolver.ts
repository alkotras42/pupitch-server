import { Args, Mutation, Resolver } from '@nestjs/graphql'
import * as GraphqlUpload from 'graphql-upload/GraphQLUpload.js'
import * as Upload from 'graphql-upload/Upload.js'

import { User } from '@/prisma/generated'
import { Authorization } from '@/src/shared/decorators/auth.decorator'
import { authorized } from '@/src/shared/decorators/authorized.decorator'

import { ChangeProfileInfoInput } from './inputs/change-profile-info.input'
import { ProfileService } from './profile.service'
import { FileValidationPipe } from '@/src/shared/pipes/file-validation.pipe'

@Resolver('Profile')
export class ProfileResolver {
	constructor(private readonly profileService: ProfileService) {}

	@Authorization()
	@Mutation(() => Boolean, { name: 'changeProfileAvatar' })
	async changeAvatar(
		@authorized() user: User,
		@Args('avatar', { type: () => GraphqlUpload }, FileValidationPipe) avatar: Upload
	) {
		return this.profileService.changeAvatar(user, avatar)
	}

	@Authorization()
	@Mutation(() => Boolean, { name: 'removeProfileAvatar' })
	async removeAvatar(@authorized() user: User) {
		return this.profileService.removeAvatar(user)
	}

	@Authorization()
	@Mutation(() => Boolean, { name: 'changeProfileInfo' })
	async changeProfileInfo(
		@authorized() user: User,
		@Args('data') input: ChangeProfileInfoInput
	) {
		return this.profileService.changeInfo(user, input)
	}
}
