import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreatePromocodeDto {
  @IsNotEmpty()
  @IsString()
  readonly code: string;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  @Max(100)
  readonly discount: number;
}
