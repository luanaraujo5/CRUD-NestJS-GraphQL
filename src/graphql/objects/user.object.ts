import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class userObject{
    @Field()
    id: number;
    @Field()
    name: string;
    @Field()
    email: string;
    @Field()
    password: string;
    @Field()
    created_at: Date;
    @Field()
    updated_at: Date;
}