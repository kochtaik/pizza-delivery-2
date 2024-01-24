import { Module } from '@nestjs/common';
import { IngredientsController, ProductsController } from './controllers';
import { IngredientsService, ProductsService } from './services';
import { ConfigModule } from '@nestjs/config';
import {
  DatabaseModule,
  Product,
  ProductSchema,
  Ingredient,
  IngredientSchema,
  PRODUCT_SERVICE,
  IMAGES_SERVICE,
} from '@app/common';
import { MongooseModule } from '@nestjs/mongoose';
import { IngredientsRepository, ProductsRepository } from './repositories';
import * as Joi from 'joi';
import { IngredientExistsValidator } from './validators';
import { AuthModule, RmqModule } from '@app/common';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['./apps/products/.env'],
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().required(),
        PORT: Joi.number().required(),
        RABBITMQ_AUTH_SERVICE_QUEUE: Joi.string().required(),
        RABBITMQ_PRODUCT_SERVICE_QUEUE: Joi.string().required(),
      }),
    }),
    DatabaseModule,
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: Ingredient.name, schema: IngredientSchema },
    ]),
    AuthModule,
    RmqModule.register({ name: PRODUCT_SERVICE }),
    RmqModule.register({ name: IMAGES_SERVICE }),
  ],
  controllers: [ProductsController, IngredientsController],
  providers: [
    IngredientsService,
    ProductsService,
    IngredientsRepository,
    ProductsRepository,
    IngredientExistsValidator,
  ],
})
export class ProductsModule {}
