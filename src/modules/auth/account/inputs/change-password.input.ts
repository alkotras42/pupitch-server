import { Field, InputType } from '@nestjs/graphql'
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator'

@InputType()
export class ChangePasswordInput {
	@Field()
	@IsString()
	@IsNotEmpty()
	@MinLength(8)
	oldPassword: string

	@Field()
	@IsString()
	@IsNotEmpty()
	@MinLength(8)
	newPassword: string
}
