import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '../database';
import { Role } from '../shared-constants';

@Schema({ timestamps: true, versionKey: false })
export class User extends AbstractDocument {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: false })
  lastName?: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ type: [{ type: String, enum: Object.values(Role) }] })
  roles: Array<Role>;

  @Prop({ type: String, required: true })
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
