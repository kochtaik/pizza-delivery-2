import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, AssignRolesDto } from './dto';
import { Roles, JwtGuard, Role, RolesGuard } from '@app/common';

@Controller('auth/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Put('/:id/assign-roles')
  @Roles(Role.ADMIN)
  @UseGuards(JwtGuard, RolesGuard)
  assignRoles(
    @Param('id') userId: string,
    @Body() assignRolesDto: AssignRolesDto,
  ) {
    return this.usersService.assignRoles(userId, assignRolesDto);
  }

  @Get()
  @Roles(Role.ADMIN)
  @UseGuards(JwtGuard, RolesGuard)
  getAllUsers(
    @Query('limit') limit: string = '',
    @Query('page') page: string = '',
  ) {
    return this.usersService.getAllUsers({ limit, page });
  }
}
