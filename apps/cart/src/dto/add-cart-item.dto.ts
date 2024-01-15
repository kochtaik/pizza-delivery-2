import { IsMongoId, IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';

export class AddToCartDto {
  @IsNotEmpty()
  @IsMongoId()
  productId: string;

  @IsNotEmpty()
  quantity: number;
}
