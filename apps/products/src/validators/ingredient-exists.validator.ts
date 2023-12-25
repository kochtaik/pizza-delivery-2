import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { IngredientsService } from '../services';

@ValidatorConstraint({ name: 'IngredientExists', async: true })
@Injectable()
export class IngredientExistsValidator implements ValidatorConstraintInterface {
  constructor(private readonly ingredientsService: IngredientsService) {}

  async validate(value: string): Promise<boolean> {
    try {
      const exists = await this.ingredientsService.getIngredientByName(value);
      return !!exists;
    } catch (error) {
      return false;
    }
  }

  defaultMessage(): string {
    return 'Ingredient does not exist. Please create it first.';
  }
}
