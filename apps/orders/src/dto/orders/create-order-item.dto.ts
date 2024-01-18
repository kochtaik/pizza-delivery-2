import { Types } from 'mongoose';
import { IsMongoId, IsNotEmpty, IsInt, Min, IsNumber } from 'class-validator';

export class CreateOrderItemDto {
  @IsMongoId()
  @IsNotEmpty()
  readonly productId: Types.ObjectId;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  readonly quantity: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  readonly price: number;
}
