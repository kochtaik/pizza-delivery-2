import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import {
  AuthModule,
  CART_SERVICE,
  DatabaseModule,
  RmqModule,
} from '@app/common';
import { OrdersRepository } from './orders.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from '@app/common';
import { PromocodesModule } from './promocodes/promocodes.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().required(),
        RABBITMQ_URI: Joi.string().required(),
        RABBITMQ_ORDERS_SERVICE_QUEUE: Joi.string().required(),
        PORT: Joi.number(),
      }),
      envFilePath: ['./apps/orders/.env'],
    }),
    PromocodesModule,
    DatabaseModule,
    AuthModule,
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    RmqModule.register({ name: CART_SERVICE }),
  ],
  controllers: [OrdersController],
  providers: [OrdersService, OrdersRepository],
  exports: [OrdersService],
})
export class OrdersModule {}
