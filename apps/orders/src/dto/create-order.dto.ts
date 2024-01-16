import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  Min,
  ValidateNested,
} from 'class-validator';
import { Types } from 'mongoose';
import { CreateOrderItemDto } from './create-order-item.dto';

export class CreateOrderDto {
  @IsMongoId()
  @IsNotEmpty()
  readonly userId: Types.ObjectId;

  @IsNotEmpty()
  @IsBoolean()
  readonly isPaid: boolean;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  readonly totalAmount: number;

  @IsNotEmpty()
  @IsArray()
  @Type(() => CreateOrderItemDto)
  readonly products: Array<CreateOrderItemDto>;

  @IsArray()
  @IsMongoId({ each: true })
  readonly appliedPromocodes: Array<Types.ObjectId>;
}
