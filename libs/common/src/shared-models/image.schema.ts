import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '../database';

@Schema({ versionKey: false })
export class Image extends AbstractDocument {
  @Prop({ type: String, required: true })
  readonly url: string;

  @Prop({ type: String, required: true })
  readonly mimetype: string;

  @Prop({ type: String, required: true })
  readonly filename: string;

  @Prop({ type: String, required: true })
  readonly originalname: string;
}

export const ImageSchema = SchemaFactory.createForClass(Image);
