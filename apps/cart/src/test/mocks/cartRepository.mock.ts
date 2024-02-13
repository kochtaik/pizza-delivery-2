import { AbstractRepositoryMock, Cart } from '@app/common';
import { cartStub } from '../stubs/cart.stub';

export class CartRepositoryMock extends AbstractRepositoryMock<Cart> {
  protected entityStub = cartStub();
}
