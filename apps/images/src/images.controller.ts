import {
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
  Res,
  Delete,
  NotFoundException,
  Next,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import type { NextFunction, Response, Request } from 'express';
import { diskStorage } from 'multer';
import { STORAGE_FOLDER } from './constants';
import { imageFileFilter, editFileName } from './utils';
import { unlink } from 'fs/promises';
import { extractBaseUrlFromRequest } from '@app/common';
import { ImagesRepository } from './images.repository';

@Controller('images')
export class ImagesController {
  constructor(private readonly imagesRepository: ImagesRepository) {}

  @Post('add')
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
    const baseUrl = extractBaseUrlFromRequest(request);
    const url = `${baseUrl}/images/${file.filename}`;

    await this.imagesRepository.create({
      url,
      filename: file.filename,
      mimetype: file.mimetype,
      originalname: file.originalname,
    });

    return { url: `${baseUrl}/images/${file.filename}` };
  }

  @Get(':imgName')
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

  @Delete(':imgName')
  async deleteImage(@Param('imgName') imgName: string) {
    try {
      await unlink(`${STORAGE_FOLDER}/${imgName}`);
      await this.imagesRepository.deleteOne({ filename: imgName });
      return { success: true };
    } catch (error) {
      if (error.code === 'ENOENT') {
        throw new NotFoundException('Image does not exist');
      }

      throw error;
    }
  }
}
