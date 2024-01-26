import {
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
  Res,
  Delete,
  Next,
  Req,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import type { NextFunction, Response, Request } from 'express';
import { diskStorage } from 'multer';
import { STORAGE_FOLDER } from './constants';
import { imageFileFilter, editFileName } from './utils';
import { MessagePattern } from '@nestjs/microservices';
import { ImagesService } from './images.service';
import { JwtGuard } from '@app/common';

@Controller('images')
export class ImagesController {
  constructor(private readonly imageService: ImagesService) {}

  @Post('add')
  @UseGuards(JwtGuard)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: STORAGE_FOLDER,
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async create(
    @Req() request: Request,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.imageService.createImage(request, file);
  }

  @Get('/file/:imgName')
  async getSingleImage(
    @Res() res: Response,
    @Next() next: NextFunction,
    @Param('imgName') imgName: string,
  ) {
    return res.sendFile(
      imgName,
      {
        root: STORAGE_FOLDER,
      },
      (err: Error & { code: string }) => {
        if (err && err.code === 'ENOENT') {
          err.message = 'Image does not exist';
          next(err);
        }
      },
    );
  }

  @Get(':id')
  @UseGuards(JwtGuard)
  async getImageById(@Param('id') id: string) {
    return this.imageService.getImageById(id);
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  async deleteImage(@Param('id') id: string) {
    return this.deleteImage(id);
  }

  @MessagePattern('get-image')
  async getImage(imageId: string) {
    return this.imageService.getImageById(imageId);
  }
}
