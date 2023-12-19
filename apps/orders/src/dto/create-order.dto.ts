import { IsString, IsNumber, IsNotEmpty, Min, IsMongoId, IsArray } from "class-validator"
import { Types } from "mongoose";

export class CreateOrderDto {
    @IsString()
    @IsNotEmpty()
    readonly user: string;

    @IsNumber()
    @Min(0, { message: 'Price must be greater than 0' })
    readonly price: number

    @IsArray()
    @IsMongoId({ each: true })
    readonly products: Array<Types.ObjectId>
}