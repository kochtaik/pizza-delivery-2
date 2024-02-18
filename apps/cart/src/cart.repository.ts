import { AbstractRepository, Cart, CartItem } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model, Types } from 'mongoose';

@Injectable()
export class CartRepository extends AbstractRepository<Cart> {
  protected readonly logger = new Logger(CartRepository.name);

  constructor(
    @InjectModel(Cart.name) model: Model<Cart>,
    @InjectConnection() connection: Connection,
  ) {
    super(model, connection);
  }

  public async clearCart(cartId: string) {
    return this.deleteOne({ _id: new Types.ObjectId(cartId) });
  }

  public async addToCart(
    userCartId: Types.ObjectId,
    cartItem: Omit<CartItem, 'productId'> & { productId: string },
  ) {
    return this.findOneAndUpdate(
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

  public async updateItemQuantity(
    userCartId: string,
    productId: string,
    quantity: number,
  ) {
    if (quantity === 0) {
      return this.findOneAndUpdate(
        { _id: userCartId },
        { $pull: { items: { productId } } },
      );
    }

    return this.findOneAndUpdate(
      { _id: userCartId, 'items.productId': productId },
      { 'items.$.quantity': quantity },
    );
  }

  public async updateTotalAmount(userCartId: Types.ObjectId) {
    return this.findOneAndUpdate({ _id: userCartId }, [
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

  public async createUserCart(userId: string) {
    return this.create({
      userId: new Types.ObjectId(userId),
      items: [],
      totalAmount: 0,
    });
  }
}
