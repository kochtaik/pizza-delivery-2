import { AbstractDocument } from '@app/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Product } from '@app/common';

@Schema({
  versionKey: false,
  timestamps: true,
})
export class Order extends AbstractDocument {
  @Prop({ required: true })
  user: string;

  @Prop()
  price: number;

  @Prop({ type: Types.ObjectId, ref: Product.name, required: true })
  products: Types.ObjectId[];
}

export const OrderSchema = SchemaFactory.createForClass(Order);
