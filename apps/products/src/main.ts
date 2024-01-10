import { NestFactory } from '@nestjs/core';
import { ProductsModule } from './products.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { useContainer } from 'class-validator';
import { PRODUCT_SERVICE, RmqService } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(ProductsModule);
  const config = app.get(ConfigService);
  const rmqService = app.get<RmqService>(RmqService);

  // Required for injecting dependencies into custom validators
  useContainer(app.select(ProductsModule), { fallbackOnErrors: true });
  app.connectMicroservice(rmqService.getOptions(PRODUCT_SERVICE, true));
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  await app.startAllMicroservices();
  await app.listen(config.get('PORT') || 3001);
}
bootstrap();
