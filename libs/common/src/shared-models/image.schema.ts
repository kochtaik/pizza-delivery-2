import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '../database';

@Schema()
export class Image extends AbstractDocument {
  @Prop({ type: Buffer, required: true })
  readonly buffer: Buffer;

  @Prop({ type: String, required: true })
  readonly mimetype: string;

  @Prop({ type: String, required: true })
  readonly originalname: string;
}

export const ImageSchema = SchemaFactory.createForClass(Image);
