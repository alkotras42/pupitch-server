import { Field, InputType } from '@nestjs/graphql'
import { IsEmail, IsNotEmpty, IsOptional, Length, MinLength } from 'class-validator'

@InputType()
export class DeactivateAccountInput {
	@Field(() => String)
	@IsEmail()
	@IsNotEmpty()
	email: string

	@Field(() => String)
	@IsNotEmpty()
    @MinLength(8)
	password: string

	@Field(() => String, { nullable: true })
	@IsNotEmpty()
    @IsOptional()
	@Length(6, 6)
	pin?: string
}
