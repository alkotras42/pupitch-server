import { Field, InputType } from '@nestjs/graphql'
import {
	IsEmail,
	IsNotEmpty,
	IsOptional,
	IsString,
	Matches,
	MaxLength,
	MinLength
} from 'class-validator'

@InputType()
export class ChangeProfileInfoInput {
	@Field()
	@IsString()
	@IsNotEmpty()
	@Matches(/^[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*$/)
	username: string

	@Field()
	@IsString()
	@IsNotEmpty()
	displayName: string

	@Field()
	@IsString()
	@IsOptional()
	@MaxLength(300)
	bio?: string
}
