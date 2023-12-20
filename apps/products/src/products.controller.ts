import { Controller, Get, Post, Body, Delete, Param, UsePipes } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { MongoIdValidationPipe } from '@app/common/shared-pipes';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @Post()
  createProduct(@Body() productDto: CreateProductDto) {
    return this.productsService.createProduct(productDto);
  }

  @Get()
  getAllProducts() {
    return this.productsService.getProducts()
  }

  @Get(':id')
  @UsePipes(MongoIdValidationPipe)
  getSingleProduct(@Param('id') id: string) {
    return this.productsService.getProduct(id)
  }

  @Delete(':id')
  @UsePipes(MongoIdValidationPipe)
  deleteProduct(@Param('id') id: string) {
    return this.productsService.deleteProduct(id);
  }
}
