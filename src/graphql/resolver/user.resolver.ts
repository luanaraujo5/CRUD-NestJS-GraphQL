import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserInput } from '../inputs/create-user.input';
import { User } from '../objects/user.object';
import * as bcrypt from 'bcrypt';
import { UpdateUserInput } from '../inputs/update-user.input';

@Resolver(() => User)
export class UserResolver { //logica geral da aplicação
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  @Query(() => [User])
  async users(): Promise<User[]> {
    return this.userRepository.find();
  }

  @Mutation(() => Number)
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
  async deleteUser(@Args('id') id: number): Promise<boolean> {
    const result = await this.userRepository.delete(id);
    return result.affected > 0;
  }
}
