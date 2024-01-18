import { AbstractRepository, Promocode } from '@app/common';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';

@Injectable()
export class PromocodesRepository extends AbstractRepository<Promocode> {
  protected readonly logger = new Logger(PromocodesRepository.name);

  constructor(
    @InjectModel(Promocode.name) model: Model<Promocode>,
    @InjectConnection() connection: Connection,
  ) {
    super(model, connection);
  }

  public async getPromocodeById(promocodeId: string) {
    try {
      return await this.findOneById(promocodeId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Promo code does not exist.');
      }

      throw error;
    }
  }
}
