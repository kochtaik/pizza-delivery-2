import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '../database';

@Schema({ versionKey: false, timestamps: true })
export class Promocode extends AbstractDocument {
  @Prop({ type: String, required: true, unique: true })
  readonly code: string;

  @Prop({ type: Number, required: true, default: 0, isInteger: true })
  readonly discount: number;
}

export const PromocodeSchema = SchemaFactory.createForClass(Promocode);
