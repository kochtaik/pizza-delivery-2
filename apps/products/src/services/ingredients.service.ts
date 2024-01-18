import { BadRequestException, Injectable } from '@nestjs/common';
import { IngredientsRepository } from '../repositories';
import { CreateIngredientDto } from '../dto';
import { isDuplicatedKeyError } from '@app/common';

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
      if (isDuplicatedKeyError(error)) {
        throw new BadRequestException(
          'Ingredient with this name already exists',
        );
      }
    }
  }
}
