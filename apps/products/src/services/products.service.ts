import { Injectable } from '@nestjs/common';
import { CreateProductDto, UpdateProductDto } from './../dto';
import { ProductsRepository } from './../repositories';

@Injectable()
export class ProductsService {
  constructor(private readonly productsRepository: ProductsRepository) {}

  async createProduct(productDto: CreateProductDto) {
    return this.productsRepository.create(productDto);
  }

  async updateProduct(productId: string, updateProductDto: UpdateProductDto) {
    return this.productsRepository.findOneAndUpdate(
      { _id: productId },
      updateProductDto,
    );
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