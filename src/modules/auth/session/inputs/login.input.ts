import { Field, InputType } from '@nestjs/graphql'
import {
	IsEmail,
	IsEmpty,
	IsNotEmpty,
	IsOptional,
	IsString,
	Length,
	Matches,
	MinLength
} from 'class-validator'

@InputType()
export class LoginInput {
	@Field()
	@IsString()
	@IsNotEmpty()
	login: string

	@Field()
	@IsString()
	@IsNotEmpty()
	@MinLength(8)
	password: string

	@Field(() => String, { nullable: true })
	@IsOptional()
	@IsString()
	@Length(6, 6)
	pin?: string
}
