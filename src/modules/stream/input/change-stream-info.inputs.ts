import { Field, InputType } from '@nestjs/graphql'
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'

@InputType()
export class ChangeStreamInfoInput {
	@Field(() => String)
	@IsNotEmpty()
	@IsString()
	title: string

	@Field(() => String, { nullable: true })
	@IsOptional()
	@IsString()
	categoryId: string
}
