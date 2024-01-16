import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '../database';
import { Types } from 'mongoose';
import { CartItem } from './cart.schema';

@Schema({ timestamps: true, versionKey: false })
export class Order extends AbstractDocument {
  @Prop({ type: Types.ObjectId, required: true, ref: 'User' })
  readonly userId: Types.ObjectId;

  @Prop({ type: Boolean, required: true })
  readonly isPaid: boolean;

  @Prop({
    type: Number,
    required: true,
    default: 0,
    get: (value: number) => parseFloat(value.toFixed(2)),
    set: (value: number) => parseFloat(value.toFixed(2)),
  })
  readonly totalAmount: number;

  @Prop({ required: true })
  readonly products: Array<CartItem>;

  @Prop({
    required: true,
    type: [{ type: Types.ObjectId, unique: true, ref: 'Promocode' }],
  })
  readonly appliedPromocodes: Array<Types.ObjectId>;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
