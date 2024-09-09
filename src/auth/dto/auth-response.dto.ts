import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class AuthResponseDto {
  @Field()
  accessToken: string;
}
