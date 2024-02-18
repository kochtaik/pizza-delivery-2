import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CartRepository } from './cart.repository';
import { UpdateCartDto } from './dto';
import { ClientProxy } from '@nestjs/microservices';
import { PRODUCT_SERVICE, Product } from '@app/common';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class CartService {
  constructor(
    private readonly cartRepository: CartRepository,
    @Inject(PRODUCT_SERVICE) private readonly productService: ClientProxy,
  ) {}

  public async updateCart(userId: string, updateCartDto: UpdateCartDto) {
    const userCart = await this.getUserCart(userId);
    const cartProduct = userCart.items.find(
      (cartItem) => cartItem.productId.toString() === updateCartDto.productId,
    );

    if (!cartProduct && updateCartDto.quantity === 0) {
      throw new NotFoundException(
        `Product ${updateCartDto.productId} is not added to the cart, so quantity cannot be 0`,
      );
    }

    const actualProduct = await this.getProduct(updateCartDto.productId);

    if (!cartProduct) {
      await this.cartRepository.addToCart(userCart._id.toString(), {
        ...updateCartDto,
        price: actualProduct.price,
      });
    } else {
      await this.cartRepository.updateItemQuantity(
        userCart._id.toString(),
        cartProduct.productId.toString(),
        updateCartDto.quantity,
      );
    }

    return await this.cartRepository.updateTotalAmount(userCart._id);
  }

  public async getUserCart(userId: string) {
    try {
      return await this.cartRepository.findOne({ userId });
    } catch (error) {
      if (error instanceof NotFoundException) {
        return await this.cartRepository.createUserCart(userId);
      }

      throw error;
    }
  }

  public async clearCart(cartId: string) {
    return await this.cartRepository.clearCart(cartId);
  }

  private async getProduct(productId: string) {
    try {
      return await lastValueFrom(
        this.productService.send<Product, string>('getProduct', productId),
      );
    } catch (error) {
      throw new NotFoundException(`Product ${productId} not found`);
    }
  }
}
