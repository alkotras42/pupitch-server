import { Field, ID, ObjectType } from '@nestjs/graphql'

import type { User } from '@/prisma/generated'
import { StreamModel } from '@/src/modules/stream/models/stream.module'

import { SocialLinkModel } from './social-link.model'

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

	@Field(() => Boolean)
	isTotpEnabled: boolean

	@Field(() => String, { nullable: true })
	totpSecret: string

	@Field(() => Boolean)
	isDeactivated: boolean

	@Field(() => Date, { nullable: true })
	deactivatedAt: Date

	@Field(() => [SocialLinkModel], { nullable: true })
	socialLinks: SocialLinkModel[]

	@Field(() => StreamModel)
	stream: StreamModel

	@Field(() => Date)
	createdAt: Date

	@Field(() => Date)
	updatedAt: Date
}
