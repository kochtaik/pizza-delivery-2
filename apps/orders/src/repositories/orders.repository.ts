import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository, Order } from '@app/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Connection, Model, Types } from 'mongoose';
import { UpdateOrderDto } from '../dto';

@Injectable()
export class OrdersRepository extends AbstractRepository<Order> {
  protected readonly logger = new Logger(OrdersRepository.name);

  constructor(
    @InjectModel(Order.name) model: Model<Order>,
    @InjectConnection() connection: Connection,
  ) {
    super(model, connection);
  }

  public findUnpaidOrders() {
    return this.model.find({ isPaid: false });
  }

  public updateSingleOrder(
    id: string | Types.ObjectId,
    updateOrderDto: UpdateOrderDto,
  ) {
    return this.findOneAndUpdate({ _id: id }, updateOrderDto);
  }
}
