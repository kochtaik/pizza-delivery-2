import {
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { OrdersRepository } from './orders.repository';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { Types } from 'mongoose';
import { CART_SERVICE, Cart } from '@app/common';

@Injectable()
export class OrdersService {
  constructor(
    @Inject(CART_SERVICE) private readonly cartService: ClientProxy,
    private readonly ordersRepository: OrdersRepository,
  ) {}

  async createOrder(userId: string) {
    try {
      const cart = await lastValueFrom(
        this.cartService.send<Cart>('getCart', userId),
      );
      console.log({ cart });
      if (!cart) {
        throw new UnprocessableEntityException('Cart must not be empty');
      }

      const orderData = {
        userId: new Types.ObjectId(userId),
        isPaid: false,
        totalAmount: cart.totalAmount,
        products: cart.items,
      };

      const order = await this.ordersRepository.create(orderData);

      this.cartService.emit('order-created', { cartId: cart._id });
      return order;
    } catch (error) {
      console.error(error);
    }
  }
}
