import { Module } from '@nestjs/common';
import { AUTH_SERVICE, CartSchema, DatabaseModule, RmqService } from '@app/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { CartRepository } from './cart.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { RmqModule } from '@app/common';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['./apps/cart/.env'],
      validationSchema: Joi.object({
        SERVICE_NAME: Joi.string().required(),
        MONGODB_URI: Joi.string().required(),
        PORT: Joi.number().required(),
      }),
    }),
    DatabaseModule,
    MongooseModule.forFeature([{ name: 'Cart', schema: CartSchema }]),
    RmqModule.register({ name: AUTH_SERVICE }),
  ],
  controllers: [CartController],
  providers: [CartService, CartRepository, RmqService],
})
export class CartModule { }
