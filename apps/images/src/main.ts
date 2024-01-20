import { NestFactory } from '@nestjs/core';
import { ImagesModule } from './images.module';
import { ConfigService } from '@nestjs/config';
import { IMAGES_SERVICE, RmqService } from '@app/common';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(ImagesModule);
  const config = app.get(ConfigService);
  const rmqService = app.get<RmqService>(RmqService);

  app.connectMicroservice(rmqService.getOptions(IMAGES_SERVICE, true));
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  await app.startAllMicroservices();
  await app.listen(config.get('PORT') || 3004);
}
bootstrap();
