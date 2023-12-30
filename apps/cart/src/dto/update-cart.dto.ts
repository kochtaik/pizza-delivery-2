import { IsArray, IsInt, IsMongoId, IsNotEmpty, Min } from 'class-validator';
import { Types } from 'mongoose';

class CartItem {
  @IsNotEmpty()
  @IsMongoId()
  productId: Types.ObjectId;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  quantity: number;
}

export class UpdateCartDto {
  @IsNotEmpty()
  @IsArray()
  cartItems: Array<CartItem>;
}
