import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { AbstractDocument } from "../database";
import { Role } from "../shared-constants";

@Schema({ timestamps: true, versionKey: false })
export class User extends AbstractDocument {
  @Prop({ required: true })
  firstName: string;

  @Prop()
  lastName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ default: Role.USER })
  role: Role
}

export const UserSchema = SchemaFactory.createForClass(User);