import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserInput } from '../inputs/create-user.input';
import { User } from '../objects/user.object';
import * as bcrypt from 'bcrypt';
import { UpdateUserInput } from '../inputs/update-user.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../../auth/gql-auth.guard';

@Resolver(() => User)
export class UserResolver {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  @Query(() => [User])
  @UseGuards(GqlAuthGuard) // Protege a consulta de usuários com JWT
  async users(): Promise<User[]> {
    return this.userRepository.find();
  }

  @Mutation(() => Number)
  @UseGuards(GqlAuthGuard) // Protege a criação de usuários com JWT
  async createUser(@Args('data') data: CreateUserInput): Promise<number> {
    const { name, email, password, confirmPassword } = data;

    if (password !== confirmPassword) {
      throw new Error('Password and confirm password do not match');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = this.userRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    await this.userRepository.save(newUser);
    return newUser.id;
  }

  @Mutation(() => User)
  @UseGuards(GqlAuthGuard) // Protege a atualização de usuários com JWT
  async updateUser(@Args('data') data: UpdateUserInput): Promise<User> {
    const user = await this.userRepository.findOneBy({ id: data.id });

    if (!user) {
      throw new Error('User not found');
    }

    if (data.password) {
      if (data.password !== data.confirmPassword) {
        throw new Error('Password and confirm password do not match');
      }

      data.password = await bcrypt.hash(data.password, 10);
    }

    const { confirmPassword, ...updateData } = data;

    await this.userRepository.update(data.id, updateData);
    return this.userRepository.findOneBy({ id: data.id });
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard) // Protege a deleção de usuários com JWT
  async deleteUser(@Args('id') id: number): Promise<boolean> {
    const result = await this.userRepository.delete(id);
    return result.affected > 0;
  }

  @Query(() => User, { nullable: true })
  @UseGuards(GqlAuthGuard) // Protege a deleção de usuários com JWT
  async user(@Args('id') id: number): Promise<User | null> {
    return this.userRepository.findOneBy({ id });
  }
}
