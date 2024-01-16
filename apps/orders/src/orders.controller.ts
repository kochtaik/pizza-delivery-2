import { Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
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
  async getActiveOrders() {
    return this.ordersService.getActiveOrders();
  }

  @Get(':id')
  @UseGuards(JwtGuard)
  async getOrderById(@Param('id') orderId: string) {
    return this.ordersService.getOrderById(orderId);
  }
}
