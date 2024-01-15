import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';
import { CartRepository } from './cart.repository';
import { AddToCartDto } from './dto';
import { ClientProxy } from '@nestjs/microservices';
import { CartItem, PRODUCT_SERVICE, Product } from '@app/common';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class CartService {
  constructor(
    private readonly cartRepository: CartRepository,
    @Inject(PRODUCT_SERVICE) private readonly productService: ClientProxy,
  ) {}

  public async updateCart(userId: string, addToCartDto: AddToCartDto) {
    const userIdMongo = new Types.ObjectId(userId);
    const productToAddIdMongo = new Types.ObjectId(addToCartDto.productId);
    const userCart = await this.getUserCart(userIdMongo);

    const cartProduct = userCart.items.find((cartItem) =>
      cartItem.productId.equals(productToAddIdMongo),
    );

    if (!cartProduct && addToCartDto.quantity === 0) {
      throw new NotFoundException(
        `Product ${addToCartDto.productId} is not added to the cart, so quantity cannot be 0`,
      );
    }

    const actualProduct = await this.getProduct(addToCartDto.productId);

    if (!cartProduct) {
      await this.addToCart(userCart._id, {
        ...addToCartDto,
        price: actualProduct.price,
      });
    } else {
      await this.updateItemQuantity(
        userCart._id,
        cartProduct.productId,
        addToCartDto.quantity,
      );
    }

    return await this.updateTotalAmount(userCart._id);
  }

  public async clearCart(cartId: string) {
    return this.cartRepository.deleteOne({ _id: new Types.ObjectId(cartId) });
  }

  private addToCart(
    userCartId: Types.ObjectId,
    cartItem: Omit<CartItem, 'productId'> & { productId: string },
  ) {
    return this.cartRepository.findOneAndUpdate(
      { _id: userCartId },
      {
        $push: {
          items: {
            ...cartItem,
            productId: new Types.ObjectId(cartItem.productId),
          },
        },
      },
    );
  }

  private updateItemQuantity(
    userCartId: Types.ObjectId,
    productId: Types.ObjectId,
    quantity: number,
  ) {
    if (quantity === 0) {
      return this.cartRepository.findOneAndUpdate(
        { _id: userCartId },
        { $pull: { items: { productId } } },
      );
    }

    return this.cartRepository.findOneAndUpdate(
      { _id: userCartId, 'items.productId': productId },
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

  private async getProduct(productId: string) {
    try {
      return await lastValueFrom(
        this.productService.send<Product, string>('getProduct', productId),
      );
    } catch (error) {
      throw new NotFoundException(`Product ${productId} not found`);
    }
  }

  private async updateTotalAmount(userCartId: Types.ObjectId) {
    return this.cartRepository.findOneAndUpdate({ _id: userCartId }, [
      {
        $set: {
          totalAmount: {
            $sum: {
              $map: {
                input: '$items',
                as: 'item',
                in: { $multiply: ['$$item.quantity', '$$item.price'] },
              },
            },
          },
        },
      },
    ]);
  }

  private createUserCart(userId: Types.ObjectId) {
    return this.cartRepository.create({ userId, items: [], totalAmount: 0 });
  }
}
