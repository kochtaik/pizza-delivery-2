import { NestFactory } from '@nestjs/core';
import { ProductsModule } from './products.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(ProductsModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  const config = app.get(ConfigService);
  await app.listen(config.get('PORT') || 3001);
}
bootstrap();
