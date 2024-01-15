import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Request } from 'express';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) { }

  @Post()
  @UseGuards(JwtGuard)
  async createOrder(@Req() request: Request) {
    const { sub } = request.user as FullJwtPayload;
    return this.ordersService.createOrder(sub);
  }
}
