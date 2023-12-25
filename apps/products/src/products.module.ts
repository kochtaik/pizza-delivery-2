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
} from '@app/common';
import { MongooseModule } from '@nestjs/mongoose';
import { IngredientsRepository, ProductsRepository } from './repositories';
import * as Joi from 'joi';
import { IngredientExistsValidator } from './validators';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['./apps/products/.env'],
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().required(),
        PORT: Joi.number().required(),
      }),
    }),
    DatabaseModule,
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: Ingredient.name, schema: IngredientSchema },
    ]),
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
