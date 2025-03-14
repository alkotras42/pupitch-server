import { Field, InputType } from '@nestjs/graphql'
import { IsNumber, IsOptional, IsString } from 'class-validator'

@InputType()
export class FiltresInput {
	@Field(() => Number, { nullable: true })
	@IsOptional()
	@IsNumber()
	take?: number

	@Field(() => Number, { nullable: true })
	@IsOptional()
	@IsNumber()
	skip?: number

	@Field(() => String, { nullable: true })
	@IsOptional()
	@IsString()
	searchTeam?: string
}
