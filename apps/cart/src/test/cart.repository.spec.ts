import { Test } from '@nestjs/testing';
import { CartRepository } from '../cart.repository';
import { Cart, CartItem } from '@app/common';
import { getConnectionToken, getModelToken } from '@nestjs/mongoose';
import { CartModelMock } from './mocks/cartModel.mock';
import { cartStub, deleteCartStub } from './stubs/cart.stub';

describe('CartRepository', () => {
  let cartRepository: CartRepository;
  let cart: ReturnType<typeof cartStub>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        CartRepository,
        {
          provide: getModelToken(Cart.name),
          useClass: CartModelMock,
        },
        {
          provide: getConnectionToken(),
          useClass: jest.fn(),
        },
      ],
    }).compile();

    cartRepository = moduleRef.get<CartRepository>(CartRepository);
    cart = cartStub();
  });

  it('is defined', () => {
    expect(cartRepository).toBeDefined();
  });

  describe('clearCart', () => {
    beforeEach(async () => {
      jest.spyOn(cartRepository, 'deleteOne');
      await cartRepository.clearCart(cart._id);
    });

    it("calls model's deleteOne method", async () => {
      const cartId = cart._id;
      await cartRepository.clearCart(cartId);

      expect(cartRepository.deleteOne).toHaveBeenCalledWith({ _id: cartId });
    });

    it('returns info about deleted items', async () => {
      expect(cartRepository.clearCart(cart._id)).resolves.toEqual(
        deleteCartStub(),
      );
    });
  });

  describe('addToCart', () => {
    let cartItem: CartItem;
    let productId: string;
    let returnResult: any;

    beforeEach(async () => {
      cartItem = cart.items[0];
      productId = cartItem.productId as string;

      jest.spyOn(cartRepository, 'findOneAndUpdate');
      returnResult = await cartRepository.addToCart(cart._id, {
        ...cartItem,
        productId,
      });
    });

    it("calls model's findOneAndUpdate method", async () => {
      expect(cartRepository.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: cart._id },
        {
          $push: {
            items: {
              ...cartItem,
              productId,
            },
          },
        },
      );
    });

    it('returns updated cart', async () => {
      expect(returnResult).toEqual(cart);
    });
  });

  describe('updateItemQuantity', () => {
    beforeEach(async () => {
      jest.spyOn(cartRepository, 'findOneAndUpdate');
    });

    it('removes item from the cart if quantity is 0', async () => {
      await cartRepository.updateItemQuantity(
        cart._id,
        cart.items[0].productId as string,
        0,
      );

      expect(cartRepository.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: cart._id },
        { $pull: { items: { productId: cart.items[0].productId } } },
      );
    });

    it('updates item quantity in the cart', async () => {
      await cartRepository.updateItemQuantity(
        cart._id,
        cart.items[0].productId as string,
        5,
      );

      expect(cartRepository.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: cart._id, 'items.productId': cart.items[0].productId },
        { 'items.$.quantity': 5 },
      );
    });

    it('returns updated cart', async () => {
      const result = await cartRepository.updateItemQuantity(
        cart._id,
        cart.items[0].productId as string,
        5,
      );

      expect(result).toEqual(cart);
    });
  });

  describe('updateTotalAmount', () => {
    beforeEach(async () => {
      jest.spyOn(cartRepository, 'findOneAndUpdate');
    });

    it('updates total amount in the cart', async () => {
      await cartRepository.updateTotalAmount(cart._id);

      expect(cartRepository.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: cart._id },
        [
          {
            $set: {
              totalAmount: {
                $sum: {
                  $map: {
                    input: '$items',
                    as: 'item',
                    in: { $multiply: ['$$item.quantity', '$$item.price'] },
                  },
                },
              },
            },
          },
        ],
      );
    });

    it('returns updated cart', async () => {
      const result = await cartRepository.updateTotalAmount(cart._id);

      expect(result).toEqual(cart);
    });
  });

  describe('createUserCart', () => {
    let userId: string;
    // let returnResult: any;

    // beforeEach(async () => {
    //   userId = '65c1e0d599d26b570e2cde75';

    //   jest.spyOn(cartRepository, 'create');
    //   await cartRepository.createUserCart(userId);
    // });

    it("calls model's create method", async () => {
      jest.spyOn(cartRepository, 'create');

      await cartRepository.createUserCart(cart.userId);

      expect(cartRepository.create).toHaveBeenCalledWith({
        userId,
        items: [],
        totalAmount: 0,
      });
    });

    // it('returns created cart', async () => {
    //   expect(returnResult).toEqual(cart);
    // });
  });
});
