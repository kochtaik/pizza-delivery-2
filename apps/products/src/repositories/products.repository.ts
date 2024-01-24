import { AbstractRepository, Product } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';

@Injectable()
export class ProductsRepository extends AbstractRepository<Product> {
  protected readonly logger = new Logger(ProductsRepository.name);

  constructor(
    @InjectModel(Product.name) model: Model<Product>,
    @InjectConnection() connection: Connection,
  ) {
    super(model, connection);
  }

  async removeImageFromProduct(url: string) {
    return this.model.updateMany({ image: url }, { $set: { image: '' } });
  }
}
