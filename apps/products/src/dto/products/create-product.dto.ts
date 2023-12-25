import {
  IsNotEmpty,
  IsString,
  Min,
  IsNumber,
  IsArray,
  ArrayUnique,
  Validate,
} from 'class-validator';
import { IngredientExistsValidator } from '../../validators';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
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

  @IsArray()
  @ArrayUnique()
  @Validate(IngredientExistsValidator, { each: true })
  readonly ingredients: Array<string>;
}
