import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductsRepository } from './products.repository';

@Injectable()
export class ProductsService {
  constructor(private readonly productsRepository: ProductsRepository) { }

  createProduct(productDto: CreateProductDto) {
    return this.productsRepository.create(productDto);
  }
}
