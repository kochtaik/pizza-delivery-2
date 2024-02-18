import { productStub } from '../stubs/product.stub';

export const ProductServiceMock = {
  send: jest.fn().mockResolvedValue(productStub()),
};
