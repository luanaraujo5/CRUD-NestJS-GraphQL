import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { CreateUserArgs } from "../args/create-user.args";
import { userObject } from "../objects/user.object";

@Resolver()
export class UserResolver{
    @Query(() => String)
    users(){
        return 'Hello World';
    }
    @Mutation(() => userObject)
    createUser(@Args() args: CreateUserArgs){
        console.log(args);
        return args.data;
    }
}