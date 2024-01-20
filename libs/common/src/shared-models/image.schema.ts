import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '../database';

@Schema()
export class Image extends AbstractDocument {
  @Prop({ type: String, required: true })
  readonly url: string;
}

export const ImageSchema = SchemaFactory.createForClass(Image);
