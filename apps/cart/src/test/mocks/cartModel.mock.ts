import { AbstractRepositoryMock, Cart } from '@app/common';
import { cartStub } from '../stubs/cart.stub';

export class CartModelMock extends AbstractRepositoryMock<Cart> {
  protected entityStub: Cart = cartStub();
}
