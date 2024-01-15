import {
  Body,
  Controller,
  // Get,
  // Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto';
import { Request } from 'express';
import { FullJwtPayload, JwtGuard } from '@app/common';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('add')
  @UseGuards(JwtGuard)
  async addToCart(
    @Req() req: Request & { user: FullJwtPayload },
    @Body() addToCartDto: AddToCartDto,
  ) {
    return this.cartService.updateCart(req.user.sub, addToCartDto);
  }

  // @Get()
  // @UseGuards(JwtGuard)
  // async getCart(@Req() req: Request & { user: FullJwtPayload }) {
  //   return this.cartService.getCart(req.user.sub);
  // }
}
