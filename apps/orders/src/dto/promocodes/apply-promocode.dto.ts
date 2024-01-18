import { IsMongoId, IsNotEmpty } from 'class-validator';

export class ApplyPromocodeDto {
  @IsNotEmpty()
  @IsMongoId()
  readonly orderId: string;
}
