import { Test } from '@nestjs/testing';
import { CartService } from '../cart.service';
import { PRODUCT_SERVICE } from '@app/common';
import { ProductServiceMock } from './mocks/prouctService.mock';
import { CartRepositoryMock } from './mocks/cartRepository.mock';
import { updateCartDtoStub } from './stubs/updateCartDto.stub';
import { CartRepository } from '../cart.repository';
import { UpdateCartDto } from '../dto';
import { NotFoundException } from '@nestjs/common';
import * as rxjs from 'rxjs';
import { cartStub, deleteCartStub } from './stubs/cart.stub';
import { productStub } from './stubs/product.stub';

jest.mock('rxjs', () => ({
  lastValueFrom: jest.fn((x) => Promise.resolve(x)),
}));

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
    const userId = '65c1e0d599d26b570e2cde75';
    let updateCartDto: UpdateCartDto;

    beforeEach(() => {
      updateCartDto = updateCartDtoStub();
    });

    it('throws an error if product is not in the cart and quantity is 0', async () => {
      const updateCartDto = updateCartDtoStub();
      updateCartDto.quantity = 0;
      jest.spyOn(cartRepository, 'updateItemQuantity');
      jest.spyOn(cartRepository, 'addToCart');

      expect(cartService.updateCart(userId, updateCartDto)).rejects.toThrow(
        NotFoundException,
      );

      expect(cartRepository.addToCart).not.toHaveBeenCalled();
      expect(cartRepository.updateItemQuantity).not.toHaveBeenCalled();
    });

    it('throws an error if product does not exist at all', async () => {
      const lastValueFromMock = rxjs.lastValueFrom as jest.Mock;
      lastValueFromMock.mockImplementationOnce(() => {
        throw Error;
      });

      updateCartDto.productId = '65c1e0d599d26b570e2cde69';

      await expect(
        cartService.updateCart(userId, updateCartDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('adds new product to the cart', async () => {
      jest.spyOn(cartRepository, 'addToCart');
      await cartService.updateCart(userId, updateCartDto);

      expect(cartRepository.addToCart).toHaveBeenCalledWith(
        cartStub()._id,
        expect.objectContaining({
          ...updateCartDto,
          price: productStub().price,
        }),
      );
    });

    it('updates product quantity in the cart', async () => {
      updateCartDto.productId = cartStub().items[0].productId.toString();
      jest.spyOn(cartRepository, 'updateItemQuantity');
      await cartService.updateCart(userId, updateCartDto);

      expect(cartRepository.updateItemQuantity).toHaveBeenCalledWith(
        cartStub()._id,
        updateCartDto.productId,
        updateCartDto.quantity,
      );
    });

    it('updates total amount in the cart', async () => {
      jest.spyOn(cartRepository, 'updateTotalAmount');
      await cartService.updateCart(userId, updateCartDto);

      expect(cartRepository.updateTotalAmount).toHaveBeenCalledWith(
        cartStub()._id,
      );
    });

    it('returns user cart', async () => {
      const result = await cartService.updateCart(userId, updateCartDto);
      expect(result).toEqual(cartStub());
    });
  });

  describe('getUserCart', () => {
    const userId = '65c1e0d599d26b570e2cde75';

    it('returns user cart', async () => {
      jest.spyOn(cartRepository, 'findOne').mockResolvedValueOnce(cartStub());

      const result = await cartService.getUserCart(userId);
      expect(result).toEqual(cartStub());
    });

    it('creates new user cart if not found', async () => {
      jest.spyOn(cartRepository, 'findOne').mockImplementationOnce(() => {
        throw new NotFoundException();
      });
      jest.spyOn(cartRepository, 'createUserCart');

      const result = await cartService.getUserCart(userId);
      expect(result).toEqual(cartStub()); // ensuring that getUserCart doesn't throw an error
      expect(cartRepository.createUserCart).toHaveBeenCalledWith(userId);
    });

    it('throws an error if something goes wrong', async () => {
      jest.spyOn(cartRepository, 'findOne').mockImplementationOnce(() => {
        throw new Error();
      });

      await expect(cartService.getUserCart(userId)).rejects.toThrow(Error);
    });
  });

  describe('clearCart', () => {
    it('should call cartRepository.clearCart', async () => {
      jest.spyOn(cartRepository, 'clearCart');
      const cartId = cartStub()._id;
      const result = await cartService.clearCart(cartId);

      expect(cartRepository.clearCart).toHaveBeenCalledWith(cartId);
      expect(result).toEqual(deleteCartStub());
    });
  });
});
