import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { UpdateCartDto } from './dto';
import { Request } from 'express';
import { FullJwtPayload, JwtGuard } from '@app/common';
import { EventPattern, MessagePattern } from '@nestjs/microservices';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('add')
  @UseGuards(JwtGuard)
  async addToCart(
    @Req() req: Request & { user: FullJwtPayload },
    @Body() addToCartDto: UpdateCartDto,
  ) {
    return this.cartService.updateCart(req.user.sub, addToCartDto);
  }

  @EventPattern('order-created')
  async onOrderCreated(payload: { cartId: string }) {
    return this.cartService.clearCart(payload.cartId);
  }

  @Get()
  @UseGuards(JwtGuard)
  async getCart(@Req() req: Request & { user: FullJwtPayload }) {
    return this.cartService.getUserCart(req.user.sub);
  }

  @MessagePattern('get-cart')
  async getCartById(userId: string) {
    return this.cartService.getUserCart(userId);
  }
}
