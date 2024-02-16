import { AbstractRepositoryMock, Cart } from '@app/common';
import { cartStub, deleteCartStub } from '../stubs/cart.stub';

export class CartRepositoryMock extends AbstractRepositoryMock<Cart> {
  protected entityStub = cartStub();

  async clearCart() {
    return deleteCartStub();
  }

  async addToCart() {
    return this.entityStub;
  }

  async updateItemQuantity() {
    return this.entityStub;
  }

  async updateTotalAmount() {
    return this.entityStub;
  }

  async createUserCart() {
    return this.entityStub;
  }
}
