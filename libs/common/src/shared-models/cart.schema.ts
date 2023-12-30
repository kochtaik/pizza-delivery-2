import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { AbstractDocument } from '../database';

@Schema({ versionKey: false })
export class Cart extends AbstractDocument {
  @Prop({ required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  items: Array<{
    productId: Types.ObjectId;
    quantity: number;
  }>;
}

export const CartSchema = SchemaFactory.createForClass(Cart);
