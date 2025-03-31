import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import * as GraphqlUpload from 'graphql-upload/GraphQLUpload.js'
import * as Upload from 'graphql-upload/Upload.js'

import { User } from '@/prisma/generated'
import { Authorization } from '@/src/shared/decorators/auth.decorator'
import { authorized } from '@/src/shared/decorators/authorized.decorator'
import { FileValidationPipe } from '@/src/shared/pipes/file-validation.pipe'

import { ChangeStreamInfoInput } from './input/change-stream-info.inputs'
import { FiltresInput } from './input/filters.input'
import { GenerateStreamTokenInput } from './input/generate-stream-token.input'
import { GenerateStreamTokenModule } from './models/generate-stream-token.module'
import { StreamModel } from './models/stream.module'
import { StreamService } from './stream.service'

@Resolver('Stream')
export class StreamResolver {
	constructor(private readonly streamService: StreamService) {}

	@Query(() => [StreamModel], { name: 'findAllStreams' })
	async findAll(@Args('filters') input: FiltresInput) {
		return this.streamService.findAll(input)
	}

	@Query(() => [StreamModel], { name: 'findRandomStreams' })
	async findRandom() {
		return this.streamService.findRandom()
	}

	@Authorization()
	@Mutation(() => Boolean, { name: 'changeStreamInfo' })
	async changeInfo(
		@authorized() user: User,
		@Args('input') input: ChangeStreamInfoInput
	) {
		return this.streamService.updateInfo(user, input)
	}

	@Authorization()
	@Mutation(() => Boolean, { name: 'changeStreamThumbnail' })
	async changeThumbnail(
		@authorized() user: User,
		@Args('thumbnail', { type: () => GraphqlUpload }, FileValidationPipe)
		file: Upload
	) {
		return this.streamService.changeThumbnail(user, file)
	}

	@Authorization()
	@Mutation(() => Boolean, { name: 'removeStreamThumbnail' })
	async removeThumbnail(@authorized() user: User) {
		return this.streamService.removeThumbnail(user)
	}

	@Mutation(() => GenerateStreamTokenModule, { name: 'generateStreamToken' })
	async generateStreamToken(@Args('input') input: GenerateStreamTokenInput) {
		return this.streamService.generateStreamToken(input)
	}
}
