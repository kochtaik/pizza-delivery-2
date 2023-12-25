import { BadRequestException, Injectable } from '@nestjs/common';
import { IngredientsRepository } from '../repositories';
import { CreateIngredientDto } from '../dto';
import { MongoError } from 'mongodb';

@Injectable()
export class IngredientsService {
  constructor(private readonly ingredientsRepository: IngredientsRepository) {}

  async getIngredientByName(name: string) {
    return this.ingredientsRepository.findOne({ name });
  }

  async createIngredient(createIngredientDto: CreateIngredientDto) {
    try {
      return await this.ingredientsRepository.create(createIngredientDto);
    } catch (error) {
      const DUPLICATE_KEY_ERROR_CODE = 11000;

      if (
        error instanceof MongoError &&
        error.code === DUPLICATE_KEY_ERROR_CODE
      ) {
        throw new BadRequestException(
          'Ingredient with this name already exists',
        );
      }
    }
  }
}
