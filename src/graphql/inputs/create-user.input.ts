import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, MinLength, IsString } from 'class-validator';

@InputType()
export class CreateUserInput {
  // Defino a estrutura de dados que será passada para a mutation

  @Field()
  @IsString({ message: 'The name must be a string.' })
  @IsNotEmpty({ message: 'The name cannot be empty.' })
  name: string;

  @Field()
  @IsEmail({}, { message: 'The email must be a valid email address.' })
  email: string;

  @Field()
  @MinLength(6, { message: 'The password must be at least 6 characters long.' })
  password: string;

  @Field()
  @MinLength(6, {
    message: 'The confirmation password must be at least 6 characters long.',
  })
  confirmPassword: string;
}
