import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { AbstractDocument } from '../database';

/**
 * TODO: replace with schema.
 */
export interface CartItem {
  productId: Types.ObjectId;
  quantity: number;
  price: number;
}

@Schema({ versionKey: false })
export class Cart extends AbstractDocument {
  @Prop({ required: true })
  userId: Types.ObjectId;

  @Prop({
    required: true,
    type: [{ productId: Types.ObjectId, quantity: Number, price: Number }],
  })
  items: Array<CartItem>;

  @Prop({
    required: true,
    type: Number,
    get: (v) => v.toFixed(2),
    set: (v) => parseFloat(v),
  })
  totalAmount: number;
}

export const CartSchema = SchemaFactory.createForClass(Cart);
