import { Test } from '@nestjs/testing';
import { CartService } from '../cart.service';
import {  PRODUCT_SERVICE } from '@app/common';
import { ProductServiceMock } from './mocks/prouctService.mock';
import { CartRepositoryMock } from './mocks/cartRepository.mock';
import { CartRepository } from '../cart.repository';
import { UpdateCartDto } from '../dto';
import { NotFoundException } from '@nestjs/common';

describe('CartService', () => {
  let cartRepository: CartRepository;
  let cartService: CartService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        CartService,
        CartRepository,
        {
          provide: PRODUCT_SERVICE,
          useValue: ProductServiceMock,
        },
        {
          provide: CartRepository,
          useClass: CartRepositoryMock,
        },
      ],
    }).compile();

    cartRepository = moduleRef.get<CartRepository>(CartRepository);
    cartService = moduleRef.get<CartService>(CartService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(cartRepository).toBeDefined();
    expect(cartService).toBeDefined();
  });

  describe('updateCart', () => {
    it('should throw an error if product is not in the cart and quantity is 0', async () => {
      const userId = '65c1e0d599d26b570e2cde75';

      const updateCartDto: UpdateCartDto = {
        productId: '65c1e0d599d26b570e2cde70',
        quantity: 0,
      };

      expect(cartService.updateCart(userId, updateCartDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
