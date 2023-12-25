import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '../database/abstract.schema';

@Schema({ versionKey: false, timestamps: true })
export class Product extends AbstractDocument {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true, min: [0, 'Price must be greater than 0'] })
  price: number;

  @Prop({ required: false, min: [0, 'Weight must be greater than 0'] })
  weight: number;

  @Prop({ required: false })
  description: string;

  @Prop({ required: false })
  ingredients: Array<string>;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
