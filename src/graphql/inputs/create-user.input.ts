import { Field, InputType, ObjectType } from "@nestjs/graphql";

@InputType()
export class CreateUserInput {
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