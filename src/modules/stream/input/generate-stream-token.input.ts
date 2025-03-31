import { Field, InputType } from '@nestjs/graphql'
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'

@InputType()
export class GenerateStreamTokenInput {
	@Field(() => String)
	@IsNotEmpty()
	@IsString()
	userId: string

	@Field(() => String)
	@IsOptional()
	@IsString()
	channelId: string
}
