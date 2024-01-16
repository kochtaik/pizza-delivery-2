import { IsMongoId, IsNotEmpty } from 'class-validator';

export class ApplyPromocodeDto {
  @IsMongoId()
  @IsNotEmpty()
  readonly orderId: string;
}
