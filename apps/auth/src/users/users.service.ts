import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import * as argon from 'argon2';
import { Role } from '@app/common';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async checkIfUserExists(email: string) {
    try {
      await this.usersRepository.findOne({ email });
      throw new UnprocessableEntityException('User already exists');
    } catch (error) {
      if (error instanceof UnprocessableEntityException) {
        throw error;
      }
    }
  }

  async createUser(createUserDto: CreateUserDto) {
    await this.checkIfUserExists(createUserDto.email);

    const hash = await argon.hash(createUserDto.password);

    const userToSave: CreateUserDto & { role: Role } = {
      ...createUserDto,
      password: hash,
      role: Role.USER,
    };

    return await this.usersRepository.create(userToSave);
  }
}
