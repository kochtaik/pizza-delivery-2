import { Module } from '@nestjs/common';
import { OrdersController, PromocodesController } from './controllers';
import { OrdersService, PromocodesService } from './services';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import {
  AuthModule,
  CART_SERVICE,
  DatabaseModule,
  Promocode,
  PromocodeSchema,
  RmqModule,
} from '@app/common';
import { OrdersRepository, PromocodesRepository } from './repositories';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from '@app/common';

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
    DatabaseModule,
    AuthModule,
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
      { name: Promocode.name, schema: PromocodeSchema },
    ]),
    RmqModule.register({ name: CART_SERVICE }),
  ],
  controllers: [OrdersController, PromocodesController],
  providers: [
    OrdersService,
    PromocodesService,
    OrdersRepository,
    PromocodesRepository,
  ],
})
export class OrdersModule {}
