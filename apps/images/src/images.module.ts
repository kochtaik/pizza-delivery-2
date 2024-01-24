import { Module } from '@nestjs/common';
import { ImagesController } from './images.controller';
import { ImagesRepository } from './images.repository';
import { ImagesService } from './images.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  AuthModule,
  DatabaseModule,
  ImageSchema,
  Image,
  RmqModule,
  IMAGES_SERVICE,
  PRODUCT_SERVICE,
} from '@app/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { MulterModule } from '@nestjs/platform-express';
import { STORAGE_FOLDER } from './constants';

@Module({
  imports: [
    MulterModule.register({
      dest: STORAGE_FOLDER,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['./apps/images/.env'],
      validationSchema: Joi.object({
        RABBITMQ_URI: Joi.string().required(),
        RABBITMQ_IMAGES_SERVICE_QUEUE: Joi.string().required(),
      }),
    }),
    DatabaseModule,
    MongooseModule.forFeature([{ name: Image.name, schema: ImageSchema }]),
    AuthModule,
    RmqModule.register({ name: IMAGES_SERVICE }),
    RmqModule.register({ name: PRODUCT_SERVICE }),
  ],
  controllers: [ImagesController],
  providers: [ImagesService, ImagesRepository],
})
export class ImagesModule {}
