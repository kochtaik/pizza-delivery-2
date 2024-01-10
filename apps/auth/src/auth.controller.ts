import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from './users/dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { MessagePattern } from '@nestjs/microservices';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('signup')
  async signup(@Body() signupDto: CreateUserDto) {
    return this.authService.signup(signupDto);
  }

  @MessagePattern('verify')
  async verify(token: string) {
    return this.authService.verifyToken(token);
  }

  @Get('protected')
  @UseGuards(AuthGuard())
  async protected() {
    return 'Protected route';
  }
}
