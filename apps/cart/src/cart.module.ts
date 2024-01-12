import { Module } from '@nestjs/common';
import { AuthModule, CartSchema, DatabaseModule } from '@app/common';
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
        MONGODB_URI: Joi.string().required(),
        PORT: Joi.number().required(),
      }),
    }),
    DatabaseModule,
    MongooseModule.forFeature([{ name: 'Cart', schema: CartSchema }]),
    AuthModule,
    RmqModule,
  ],
  controllers: [CartController],
  providers: [CartService, CartRepository],
})
export class CartModule {}
