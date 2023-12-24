import { AbstractRepository } from '@app/common';
import { Ingredient } from './../schemas';
import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';

@Injectable()
export class IngredientsRepository extends AbstractRepository<Ingredient> {
  protected readonly logger = new Logger(IngredientsRepository.name);

  constructor(
    @InjectModel(Ingredient.name) model: Model<Ingredient>,
    @InjectConnection() connection: Connection,
  ) {
    super(model, connection);
  }
}
