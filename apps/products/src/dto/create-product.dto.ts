import { IsNotEmpty, IsString, Min, IsNumber } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  /**
   * Todo: make unique
   */
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly type: string;

  @IsNumber()
  @Min(0, { message: 'Price must be greater than 0' })
  readonly price: number;

  @IsString()
  readonly description: string;

  @IsNumber()
  @Min(0, { message: 'Weight must be greater than 0' })
  readonly weight: number;
}
