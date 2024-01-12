import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { UpdateCartDto } from './dto/update-cart.dto';
import { Types } from 'mongoose';
import { CartRepository } from './cart.repository';
import { AUTH_SERVICE } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class CartService {
  constructor(
    private readonly cartRepository: CartRepository,
    @Inject(AUTH_SERVICE) private authClient: ClientProxy,
  ) { }

  getItemByProductId(userId: Types.ObjectId, productId: Types.ObjectId) {
    return this.cartRepository.findOne({
      userId,
      'items.productId': productId,
    });
  }

  private addToCart(
    userCartId: Types.ObjectId,
    productId: Types.ObjectId,
    quantity: number,
  ) {
    return this.cartRepository.findOneAndUpdate(
      { _id: userCartId },
      {
        $push: {
          items: {
            _id: new Types.ObjectId(),
            productId,
            quantity,
          },
        },
      },
    );
  }

  private updateItemQuantity(
    userCartId: Types.ObjectId,
    cartItemId: Types.ObjectId,
    quantity: number,
  ) {
    if (quantity === 0) {
      return this.cartRepository.deleteOne({
        _id: userCartId,
        'items._id': cartItemId,
      });
    }

    return this.cartRepository.findOneAndUpdate(
      { _id: userCartId, 'items._id': cartItemId },
      { 'items.$.quantity': quantity },
    );
  }

  private async getUserCart(userId: Types.ObjectId) {
    try {
      return await this.cartRepository.findOne({ userId });
    } catch (error) {
      if (error instanceof NotFoundException) {
        return await this.createUserCart(userId);
      }

      throw error;
    }
  }

  private createUserCart(userId: Types.ObjectId) {
    return this.cartRepository.create({ userId, items: [] });
  }

  public async updateCart(userId: string, updateCartDto: UpdateCartDto) {
    const { cartItems } = updateCartDto;

    const userMongoId = new Types.ObjectId(userId);
    const userCart = await this.getUserCart(userMongoId);

    const updatePromises = cartItems.map(async (cartItem) => {
      const existingCartItem: any = userCart.items.find(
        (item) => item.productId === cartItem.productId,
      );

      if (existingCartItem) {
        return await this.updateItemQuantity(
          userCart._id,
          existingCartItem._id,
          cartItem.quantity,
        );
      } else {
        return await this.addToCart(
          userCart._id,
          cartItem.productId,
          cartItem.quantity,
        );
      }
    });

    return (await Promise.all(updatePromises)).at(-1);
  }
}
