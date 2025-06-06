import { Field, ID, ObjectType } from '@nestjs/graphql'

import { Category, Stream } from '@/prisma/generated'

import { StreamModel } from '../../stream/models/stream.module'

@ObjectType()
export class CategoryModel implements Category {
	@Field(() => ID)
	id: string

	@Field(() => String)
	title: string

	@Field(() => String)
	slug: string

	@Field(() => String, { nullable: true })
	description: string

	@Field(() => String, { nullable: true })
	thumbnailUrl: string

	@Field(() => [StreamModel], { nullable: true })
	streams: StreamModel[]

	@Field(() => Date)
	createdAt: Date

	@Field(() => Date)
	updatedAt: Date
}
