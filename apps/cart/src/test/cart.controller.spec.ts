import { Test } from '@nestjs/testing';
import { CartController } from '../cart.controller';
import { CartService } from '../cart.service';
import { AUTH_SERVICE, authGuardMock, requestStub } from '@app/common';
import { cartStub } from './stubs/cart.stub';
import { Types } from 'mongoose';
import { updateCartDtoStub } from './stubs/updateCartDto.stub';

jest.mock('../cart.service');

describe('CartController', () => {
  let cartController: CartController;
  let cartService: CartService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [],
      controllers: [CartController],
      providers: [
        CartService,
        {
          provide: AUTH_SERVICE,
          useValue: authGuardMock,
        },
      ],
    }).compile();

    cartController = moduleRef.get<CartController>(CartController);
    cartService = moduleRef.get<CartService>(CartService);

    jest.clearAllMocks();
  });

  describe('getCartById', () => {
    it('should call CartService', async () => {
      const cart = cartStub();

      await cartController.getCartById(cart.userId as string);
      expect(cartService.getUserCart).toHaveBeenCalledWith(
        new Types.ObjectId(cart.userId),
      );
    });
  });

  describe('getCart', () => {
    it('should call cartService with appropriate value', async () => {
      const request = requestStub();
      await cartController.getCart(request);
      expect(cartService.getUserCart).toHaveBeenCalledWith(
        new Types.ObjectId(request.user.sub),
      );
    });
  });

  describe('onOrderCreated', () => {
    it("should call cart service's clearCart method", async () => {
      const cart = cartStub();
      const payload = { cartId: cart._id as string };
      await cartController.onOrderCreated(payload);
      expect(cartService.clearCart).toHaveBeenCalledWith(payload.cartId);
    });
  });

  describe('addToCart', () => {
    it('should call updateCart method from cartService', async () => {
      const request = requestStub();
      const updateCartDto = updateCartDtoStub();
      await cartController.addToCart(request, updateCartDto);
      expect(cartService.updateCart).toHaveBeenCalledWith(
        request.user.sub,
        updateCartDto,
      );
    });
  });
});
