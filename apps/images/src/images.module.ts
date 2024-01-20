import { Module } from '@nestjs/common';
import { ImagesController } from './images.controller';
import { ImagesService } from './images.service';
import { ImagesRepository } from './images.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule, DatabaseModule, ImageSchema, Image } from '@app/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['./apps/images/.env'],
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().required(),
        RABBITMQ_URI: Joi.string().required(),
        RABBITMQ_IMAGES_SERVICE_QUEUE: Joi.string().required(),
      }),
    }),
    DatabaseModule,
    MongooseModule.forFeature([{ name: Image.name, schema: ImageSchema }]),
    AuthModule,
  ],
  controllers: [ImagesController],
  providers: [ImagesService, ImagesRepository],
})
export class ImagesModule {}
