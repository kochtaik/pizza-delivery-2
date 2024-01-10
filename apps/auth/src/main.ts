import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions } from '@nestjs/microservices';
import { RmqService } from '@app/common';
import { AUTH_SERVICE } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  const config = app.get(ConfigService);

  const rmqService = app.get<RmqService>(RmqService);

  app.connectMicroservice<MicroserviceOptions>(
    rmqService.getOptions(AUTH_SERVICE, true),
  );

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  const port = config.get<string | number>('PORT') || 3003;

  await app.startAllMicroservices();
  await app.listen(port);
}
bootstrap();
