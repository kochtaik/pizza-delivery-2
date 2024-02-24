import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import * as argon from 'argon2';
import { PaginationOptions, Role } from '@app/common';
import { AssignRolesDto } from './dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) { }

  public async getUserByEmail(email: string) {
    return await this.usersRepository.getUserByEmail(email);
  }

  async assignRoles(userId: string, { roles }: AssignRolesDto) {
    return await this.usersRepository.assignRoles(userId, roles);
  }

  private async checkIfUserExists(email: string) {
    try {
      await this.getUserByEmail(email);
      throw new UnprocessableEntityException('User already exists');
    } catch (error) {
      if (error instanceof UnprocessableEntityException) {
        throw error;
      }
    }
  }

  public async createUser(createUserDto: CreateUserDto) {
    await this.checkIfUserExists(createUserDto.email);

    const hash = await argon.hash(createUserDto.password);

    const userToSave: CreateUserDto & { roles: Array<Role>; } = {
      ...createUserDto,
      password: hash,
      roles: [Role.USER],
    };

    return await this.usersRepository.create(userToSave);
  }

  public async getAllUsers(paginationOptions: PaginationOptions) {
    return await this.usersRepository.paginate(paginationOptions);
  }

  public deleteAccount(userId: string) {
    return this.usersRepository.deleteOne({ _id: userId });
  }
}
