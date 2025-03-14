import { Args, Query, Resolver } from '@nestjs/graphql'

import { FiltresInput } from './input/filters.input'
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
}
