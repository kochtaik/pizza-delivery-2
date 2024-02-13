import { cartStub, deleteCartStub } from '../test/stubs/cart.stub';

export const CartService = jest.fn().mockReturnValue({
  updateCart: jest.fn().mockResolvedValue(cartStub()),
  clearCart: jest.fn().mockResolvedValue(deleteCartStub()),
  getUserCart: jest.fn().mockResolvedValue(cartStub()),
});
