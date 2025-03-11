import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

@InputType()
export class SocialLinkInput {
    @Field(() => String)
    @IsString()
    @IsNotEmpty()
    title: string

    @Field(() => String)
    @IsUrl()
    @IsNotEmpty()
    url: string
}
