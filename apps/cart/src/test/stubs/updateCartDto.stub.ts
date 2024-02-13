import { UpdateCartDto } from '../../dto';

export const updateCartDtoStub = (): UpdateCartDto => {
  return {
    productId: '1234',
    quantity: 12,
  };
};
