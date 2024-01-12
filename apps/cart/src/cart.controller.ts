import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { UpdateCartDto } from './dto/update-cart.dto';
import { Request } from 'express';
import { FullJwtPayload, JwtGuard } from '@app/common';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  @UseGuards(JwtGuard)
  updateCart(@Req() request: Request, @Body() updateCartDto: UpdateCartDto) {
    const { sub: userId } = request.user as FullJwtPayload;
    return this.cartService.updateCart(userId, updateCartDto);
  }

  @Get()
  getCart() {
    return 'Not implemented';
  }
}
