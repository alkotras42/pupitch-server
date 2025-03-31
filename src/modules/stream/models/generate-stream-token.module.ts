import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class GenerateStreamTokenModule {
	@Field(() => ID)
	token: string
}
