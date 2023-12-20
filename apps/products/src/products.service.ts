import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductsRepository } from './products.repository';

@Injectable()
export class ProductsService {
  constructor(private readonly productsRepository: ProductsRepository) { }

  async createProduct(productDto: CreateProductDto) {
    return this.productsRepository.create(productDto);
  }

  async getProducts() {
    return this.productsRepository.find({});
  }

  async getProduct(productId: string) {
    return this.productsRepository.findOne({ _id: productId }); 
  }

  async deleteProduct(productId: string) {
    const result = await this.productsRepository.deleteOne({ _id: productId });
    return { deletedCount: result.deletedCount };
  }
}
