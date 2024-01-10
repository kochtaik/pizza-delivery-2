import { NestFactory } from '@nestjs/core';
import { CartModule } from './cart.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RmqService } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(CartModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  const config = app.get(ConfigService);
  const rmqService = app.get<RmqService>(RmqService);

  const serviceName = config.get<string>('SERVICE_NAME');

  await app.connectMicroservice(rmqService.getOptions(serviceName, true));
  await app.startAllMicroservices();

  const port = config.get<string | number>('PORT') || 3002;
  await app.listen(port);
}
bootstrap();
