import { AbstractRepository, Image } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';

@Injectable()
export class ImagesRepository extends AbstractRepository<Image> {
  protected readonly logger = new Logger(ImagesRepository.name);

  constructor(
    @InjectModel(Image.name) model: Model<Image>,
    @InjectConnection() connection: Connection,
  ) {
    super(model, connection);
  }
}
