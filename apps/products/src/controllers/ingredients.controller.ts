import { Body, Controller, Post } from '@nestjs/common';
import { IngredientsService } from '../services';
import { CreateIngredientDto } from '../dto';

@Controller('ingredients')
export class IngredientsController {
  constructor(private readonly ingredientsService: IngredientsService) {}

  @Post('')
  createIngredient(@Body() createIngredientDto: CreateIngredientDto) {
    return this.ingredientsService.createIngredient(createIngredientDto);
  }
}
