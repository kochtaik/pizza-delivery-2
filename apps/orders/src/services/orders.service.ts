import {
  Inject,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { OrdersRepository } from '../repositories';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { Types } from 'mongoose';
import { CART_SERVICE, Cart } from '@app/common';
import { UpdateOrderDto, CreateOrderDto } from '../dto';

@Injectable()
export class OrdersService {
  constructor(
    @Inject(CART_SERVICE) private readonly cartService: ClientProxy,
    private readonly ordersRepository: OrdersRepository,
  ) {}

  public async createOrder(userId: string) {
    try {
      const cart = await lastValueFrom(
        this.cartService.send<Cart>('get-cart', userId),
      );

      if (!cart || cart.items.length === 0) {
        throw new UnprocessableEntityException('Cart must not be empty');
      }

      const orderData: CreateOrderDto = {
        userId: new Types.ObjectId(userId),
        isPaid: false,
        totalAmount: cart.totalAmount,
        products: cart.items,
        appliedPromocodes: [],
      };

      const order = await this.ordersRepository.create(orderData);

      this.cartService.emit('order-created', { cartId: cart._id });
      return order;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async getActiveOrders() {
    return this.ordersRepository.findUnpaidOrders();
  }

  public async updateOrder(
    orderId: Types.ObjectId,
    updateOrderDto: UpdateOrderDto,
  ) {
    return this.ordersRepository.updateSingleOrder(orderId, updateOrderDto);
  }

  public async getOrderById(orderId: string) {
    try {
      return await this.ordersRepository.findOneById(orderId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Order does not exist');
      }

      throw error;
    }
  }
}
