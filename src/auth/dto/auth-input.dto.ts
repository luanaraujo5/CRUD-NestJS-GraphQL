import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class AuthInputDto {
  @Field()
  @IsNotEmpty()
  @IsString()
  clientId: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  clientSecret: string;
}
