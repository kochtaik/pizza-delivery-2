import { NestFactory } from '@nestjs/core';
import { CartModule } from './cart.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RmqService, CART_SERVICE } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(CartModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  const config = app.get(ConfigService);
  const rmqService = app.get<RmqService>(RmqService);

  await app.connectMicroservice(rmqService.getOptions(CART_SERVICE, true));
  await app.startAllMicroservices();

  const port = config.get<string | number>('PORT') || 3002;
  await app.listen(port);
}
bootstrap();
