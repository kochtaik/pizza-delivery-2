import { IsMongoId, IsNotEmpty } from 'class-validator';

export class UpdateCartDto {
  @IsNotEmpty()
  @IsMongoId()
  productId: string;

  @IsNotEmpty()
  quantity: number;
}
