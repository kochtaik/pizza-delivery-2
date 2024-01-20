import { Controller, Get } from '@nestjs/common';
import { ImagesService } from './images.service';

@Controller()
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Get()
  getHello(): string {
    return this.imagesService.getHello();
  }
}
