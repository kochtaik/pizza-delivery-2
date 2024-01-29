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
  Query,
} from '@nestjs/common';
import { ProductsService } from '../services';
import { CreateProductDto, UpdateProductDto } from '../dto';
import { MongoIdValidationPipe } from '@app/common/shared-pipes';
import { JwtGuard, Role, RolesGuard } from '@app/common';
import { Roles } from '@app/common/auth/decorators';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @Roles(Role.ADMIN)
  @UseGuards(JwtGuard, RolesGuard)
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
  @UseGuards(JwtGuard)
  getAllProducts(
    @Query('limit') limit: string = '',
    @Query('page') page: string = '',
  ) {
    return this.productsService.getProducts({ limit, page });
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

  @MessagePattern('getProduct')
  getProduct(id: string) {
    return this.productsService.getProduct(id);
  }

  @EventPattern('image-removed')
  async onImageRemoved(@Payload() url: string) {
    await this.productsService.removeImageFromProduct(url);
  }
}
