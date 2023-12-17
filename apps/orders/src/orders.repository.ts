import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from '@app/common';
import { Order } from './schemas/order.schema';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';

@Injectable()
export class OrdersRepository extends AbstractRepository<Order> {
  protected readonly logger = new Logger(OrdersRepository.name);

  constructor(
    @InjectModel(Order.name) model: Model<Order>,
    @InjectConnection() connection: Connection,
  ) {
    super(model, connection);
  }
}
