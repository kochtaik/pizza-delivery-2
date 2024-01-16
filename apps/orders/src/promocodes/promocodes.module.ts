import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PromocodesService } from './promocodes.service';
import { PromocodesController } from './promocodes.controller';
import { Promocode, PromocodeSchema } from '@app/common';
import { PromocodesRepository } from './promocodes.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Promocode.name, schema: PromocodeSchema },
    ]),
  ],
  exports: [PromocodesService],
  controllers: [PromocodesController],
  providers: [PromocodesService, PromocodesRepository],
})
export class PromocodesModule {}
