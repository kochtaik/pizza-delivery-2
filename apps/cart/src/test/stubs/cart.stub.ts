import { Cart } from '@app/common';

export const cartStub = (): Cart & { _id: string; userId: string } => {
  return {
    userId: '65c1e0d599d26b570e2cde75' as any,
    _id: '65c1e0d599d26b570e2cde76' as any,
    items: [
      {
        price: 12.99,
        productId: '65c1e0d599d26b570e2cde78' as any,
        quantity: 1,
      },
      {
        price: 0.33,
        productId: '65c1e0d599d26b570e2cde79' as any,
        quantity: 19,
      },
      {
        price: 123.0,
        productId: '65c1e0d599d26b570e2cde80' as any,
        quantity: 32,
      },
    ],
    totalAmount: 0,
  };
};

export const deleteCartStub = (): {
  acknowledged: boolean;
  deletedCount: number;
} => {
  return {
    acknowledged: true,
    deletedCount: 1,
  };
};
