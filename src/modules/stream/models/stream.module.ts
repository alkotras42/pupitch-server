import { Field, ID, ObjectType } from '@nestjs/graphql'

import { Category, Stream } from '@/prisma/generated'

import { UserModel } from '../../auth/account/models/user.model'
import { CategoryModel } from '../../category/models/category.model'

@ObjectType()
export class StreamModel implements Stream {
	@Field(() => ID)
	id: string

	@Field(() => String)
	title: string

	@Field(() => String, { nullable: true })
	thumbnailUrl: string

	@Field(() => String, { nullable: true })
	ingressId: string

	@Field(() => String, { nullable: true })
	serverUrl: string

	@Field(() => String, { nullable: true })
	streamKey: string

	@Field(() => Boolean)
	isLive: boolean

	@Field(() => UserModel)
	user: UserModel

	@Field(() => String)
	userId: string

	@Field(() => CategoryModel)
	category: Category

	@Field(() => String)
	categoryId: string

	@Field(() => Date)
	createdAt: Date

	@Field(() => Date)
	updatedAt: Date
}
