import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { AbstractDocument } from "../database";
import { Types } from "mongoose";

@Schema({ timestamps: true, versionKey: false })
export class Order extends AbstractDocument {
    @Prop({ type: Types.ObjectId, required: true, ref: 'User' })
    userId: Types.ObjectId;

    @Prop({ type: Boolean, required: true })
    isPaid: boolean;

    @Prop({
        type: Number,
        required: true,
        default: 0,
        get: (value: number) => parseFloat(value.toFixed(2)),
        set: (value: number) => parseFloat(value.toFixed(2)),
    })
    totalAmount: number

    @Prop({ type: [{ type: Types.ObjectId, ref: 'Product' }], required: true })
    products: Array<Types.ObjectId>
}

export const OrderSchema = SchemaFactory.createForClass(Order);