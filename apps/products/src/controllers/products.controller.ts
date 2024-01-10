import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Param,
  UsePipes,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from '../services';
import { CreateProductDto, UpdateProductDto } from '../dto';
import { MongoIdValidationPipe } from '@app/common/shared-pipes';
import { JwtGuard } from '@app/common';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @Post()
  @UseGuards(JwtGuard)
  createProduct(@Body() productDto: CreateProductDto) {
    return this.productsService.createProduct(productDto);
  }

  @Patch(':id')
  @UsePipes(MongoIdValidationPipe)
  updateProduct(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.updateProduct(id, updateProductDto);
  }

  @Get()
  getAllProducts() {
    return this.productsService.getProducts();
  }

  @Get(':id')
  @UsePipes(MongoIdValidationPipe)
  getSingleProduct(@Param('id') id: string) {
    return this.productsService.getProduct(id);
  }

  @Delete(':id')
  @UsePipes(MongoIdValidationPipe)
  deleteProduct(@Param('id') id: string) {
    return this.productsService.deleteProduct(id);
  }
}
