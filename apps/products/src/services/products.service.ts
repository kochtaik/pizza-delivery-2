import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto, UpdateProductDto } from './../dto';
import { ProductsRepository } from './../repositories';
import { IMAGES_SERVICE, Image, Product } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class ProductsService {
  constructor(
    private readonly productsRepository: ProductsRepository,
    @Inject(IMAGES_SERVICE) private readonly imagesService: ClientProxy,
  ) {}

  async createProduct(productDto: CreateProductDto) {
    const { imageId, ...rest } = productDto;
    const productData: Omit<Product, '_id'> = {
      ...rest,
      image: '',
    };

    if (productDto.imageId) {
      const image = await lastValueFrom(
        this.imagesService.send<Image>('get-image', productDto.imageId),
      ).catch(() => {
        throw new NotFoundException(
          'Image does not exist. Please, add it first.',
        );
      });

      productData.image = image.url;
    }

    return this.productsRepository.create(productData);
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

  async removeImageFromProduct(url: string) {
    return this.productsRepository.removeImageFromProduct(url);
  }
}
