import { Test, TestingModule } from '@nestjs/testing';
import { ImagesController } from './images.controller';
import { ImagesService } from './images.service';

describe('ImagesController', () => {
  let imagesController: ImagesController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ImagesController],
      providers: [ImagesService],
    }).compile();

    imagesController = app.get<ImagesController>(ImagesController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(imagesController.getHello()).toBe('Hello World!');
    });
  });
});
