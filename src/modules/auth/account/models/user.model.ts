import { Field, ID, ObjectType } from '@nestjs/graphql'

import type { User } from '@/prisma/generated'

@ObjectType()
export class UserModel implements User {
	@Field(() => ID)
	id: string

	@Field(() => String)
	email: string

	@Field(() => String)
	password: string

	@Field(() => String)
	username: string

	@Field(() => String, { nullable: true })
	displayName: string

	@Field(() => String, { nullable: true })
	avatar: string

	@Field(() => String, { nullable: true })
	bio: string

	@Field(() => Boolean)
	isVerified: boolean

	@Field(() => Boolean)
	isEmailVerified: boolean

	@Field(() => Date)
	createdAt: Date

	@Field(() => Date)
	updatedAt: Date
}
