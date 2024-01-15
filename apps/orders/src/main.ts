import { NestFactory } from '@nestjs/core';
import { OrdersModule } from './orders.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { ORDERS_SERVICE, RmqService } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(OrdersModule);
  const rmqService = app.get(RmqService);
  app.connectMicroservice(rmqService.getOptions(ORDERS_SERVICE, true));
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  const config = app.get(ConfigService);

  await app.startAllMicroservices();
  await app.listen(config.get('PORT') || 3000);
}
bootstrap();
