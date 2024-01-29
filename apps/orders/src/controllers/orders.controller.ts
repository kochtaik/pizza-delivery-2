import {
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from '../services';
import { Request } from 'express';
import { FullJwtPayload, JwtGuard, Role, Roles, RolesGuard } from '@app/common';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UseGuards(JwtGuard)
  async createOrder(@Req() request: Request) {
    const { sub } = request.user as FullJwtPayload;
    return this.ordersService.createOrder(sub);
  }

  @Get()
  @Roles(Role.ADMIN)
  @UseGuards(JwtGuard, RolesGuard)
  async getActiveOrders(
    @Query('limit') limit: string = '',
    @Query('page') page: string = '',
  ) {
    return this.ordersService.getActiveOrders({ limit, page });
  }

  @Get(':id')
  @UseGuards(JwtGuard)
  async getOrderById(@Param('id') orderId: string) {
    return this.ordersService.getOrderById(orderId);
  }
}
