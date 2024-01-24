import { PRODUCT_SERVICE, extractBaseUrlFromRequest } from '@app/common';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ImagesRepository } from './images.repository';
import { Request } from 'express';
import { unlink } from 'fs/promises';
import { STORAGE_FOLDER } from './constants';

@Injectable()
export class ImagesService {
  constructor(
    private readonly imagesRepository: ImagesRepository,
    @Inject(PRODUCT_SERVICE) private readonly productService: ClientProxy, // I didn't have time to find out, how to implement fanout exchange
  ) {}

  public async createImage(request: Request, file: Express.Multer.File) {
    const baseUrl = extractBaseUrlFromRequest(request);
    const url = `${baseUrl}/images/file/${file.filename}`;

    return await this.imagesRepository.create({
      url,
      filename: file.filename,
      mimetype: file.mimetype,
      originalname: file.originalname,
    });
  }

  public async deleteImage(imageId: string) {
    try {
      const image = await this.imagesRepository.findOne({ _id: imageId });

      await unlink(`${STORAGE_FOLDER}/${image.filename}`);
      await this.imagesRepository.deleteOne({ _id: imageId });

      this.productService.emit('image-removed', image.url);
      return { success: true };
    } catch (error) {
      if (error.code === 'ENOENT') {
        throw new NotFoundException('Image does not exist');
      }

      throw error;
    }
  }

  public async getImageById(imageId: string) {
    try {
      return await this.imagesRepository.findOneById(imageId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Image does not exist');
      }

      throw error;
    }
  }
}
