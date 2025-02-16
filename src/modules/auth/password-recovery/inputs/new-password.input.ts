import { IsPasswordMatching } from '@/src/shared/decorators/is-password-matching.decorator'
import { Field, InputType } from '@nestjs/graphql'
import { IsNotEmpty, IsString, IsUUID, MinLength, Validate } from 'class-validator'

@InputType()
export class NewPasswordInput {
	@Field(() => String)
	@IsUUID('4')
	@IsNotEmpty()
	token: string

	@Field()
	@IsString()
	@IsNotEmpty()
	@MinLength(8)
	password: string

	@Field()
	@IsString()
	@IsNotEmpty()
	@MinLength(8)
    @Validate(IsPasswordMatching)
	confirmPassword: string
}
