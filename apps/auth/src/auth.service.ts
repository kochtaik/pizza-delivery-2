import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from './users/users.service';
import { verify } from 'argon2';
import { CreateUserDto } from './users/dto/create-user.dto';
import { BaseJwtPayload, FullJwtPayload } from '@app/common';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
  ) { }

  private async verifyPassword(password: string, hash: string) {
    const isPasswordValid = await verify(hash, password);

    if (!isPasswordValid) {
      throw new ForbiddenException('Invalid password');
    }
  }

  private async signToken(userId: string, email: string) {
    const payload: BaseJwtPayload = { sub: userId, email };
    return this.jwtService.signAsync(payload);
  }

  async verifyToken(token: string) {
    try {
      const payload = await this.jwtService.verifyAsync<FullJwtPayload>(token);
      return payload;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  async login({ email, password }: LoginDto) {
    try {
      const user = await this.userService.getUserByEmail(email);
      await this.verifyPassword(password, user.password);
      const token = await this.signToken(user._id.toString(), user.email);

      return { token };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('User not found');
      }

      throw error;
    }
  }

  async signup(createUserDto: CreateUserDto) {
    const user = await this.userService.createUser(createUserDto);
    const token = await this.signToken(user._id.toString(), user.email);

    return { token };
  }
}
