import { AbstractDocument } from '../database';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ versionKey: false })
export class Ingredient extends AbstractDocument {
  @Prop({ required: true, unique: true })
  name: string;
}

export const IngredientSchema = SchemaFactory.createForClass(Ingredient);
