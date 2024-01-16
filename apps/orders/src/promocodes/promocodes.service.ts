import { BadRequestException, Injectable } from '@nestjs/common';
import { ApplyPromocodeDto, CreatePromocodeDto } from './dto';
import { PromocodesRepository } from './promocodes.repository';
import { OrdersService } from '../orders.service';
import { Order } from '@app/common';
import { UpdateOrderDto } from '../dto';

@Injectable()
export class PromocodesService {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly promocodesRepository: PromocodesRepository,
  ) {}
  public async applyPromocode(
    promocodeId: string,
    { orderId }: ApplyPromocodeDto,
  ) {
    const promocode =
      await this.promocodesRepository.getPromocodeById(promocodeId);
    const order = await this.ordersService.getOrderById(orderId);
    if (this.isPromocodeApplied(order, promocodeId)) {
      throw new BadRequestException(
        'This promo code has been already applied to this order.',
      );
    }

    const sumWithDiscount = this.calculateSumWithDiscount(
      promocode.discount,
      order.totalAmount,
    );
    order.appliedPromocodes.push(promocode._id);

    const updateOrderDto: UpdateOrderDto = {
      appliedPromocodes: order.appliedPromocodes,
      totalAmount: sumWithDiscount,
    };

    return await this.ordersService.updateOrder(order._id, updateOrderDto);
  }

  public async createPromocode(createPromocodeDto: CreatePromocodeDto) {
    try {
      return await this.promocodesRepository.create(createPromocodeDto);
    } catch (error) {
      // TODO: handle MongoDb error, if 'code' is not unique
      throw error;
    }
  }

  private calculateSumWithDiscount(discount: number, sum: number) {
    const subbracted = +((discount * sum) / 100).toFixed(2);
    return sum - subbracted;
  }

  private isPromocodeApplied(order: Order, promocodeId: string) {
    return order.appliedPromocodes.some((id) => id.equals(promocodeId));
  }
}
