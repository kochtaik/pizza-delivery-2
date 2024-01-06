import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from './users/users.module';
import { DatabaseModule, RmqModule } from '@app/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

@Module({
  imports: [
    RmqModule,
    UsersModule,
    DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['./apps/auth/.env'],
      validationSchema: Joi.object({
        SERVICE_NAME: Joi.string().required(),
        MONGODB_URI: Joi.string().required(),
        PORT: Joi.number().required(),
        RABBITMQ_AUTH_QUEUE: Joi.string().required(),
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
