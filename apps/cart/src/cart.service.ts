import { Injectable } from '@nestjs/common';
import { UpdateCartDto } from './dto/update-cart.dto';
import { Types } from 'mongoose';
import { CartRepository } from './cart.repository';

@Injectable()
export class CartService {
  constructor(private readonly cartRepository: CartRepository) {}

  getItemByProductId(userId: Types.ObjectId, productId: Types.ObjectId) {
    return this.cartRepository.findOne({
      userId,
      'items.productId': productId,
    });
  }

  addToCart(
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

  updateItemQuantity(
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

  getUserCart(userId: Types.ObjectId) {
    return this.cartRepository.findOne({ userId });
  }

  createUserCart(userId: Types.ObjectId) {
    return this.cartRepository.create({ userId, items: [] });
  }

  // todo: implement transaction

  async updateCart(updateCartDto: UpdateCartDto) {
    const { cartItems } = updateCartDto;

    const userId: any = 1;
    let userCart = await this.getUserCart(userId);

    if (!userCart) {
      userCart = await this.createUserCart(userId);
    }

    const updatePromises = cartItems.map(async (cartItem) => {
      const existingCartItem: any = userCart.items.find(
        (item) => item.productId === cartItem.productId,
      );

      if (existingCartItem) {
        await this.updateItemQuantity(
          userCart._id,
          existingCartItem._id,
          cartItem.quantity,
        );
      } else {
        await this.addToCart(
          userCart._id,
          cartItem.productId,
          cartItem.quantity,
        );
      }
    });

    return await Promise.all(updatePromises);
  }
}
