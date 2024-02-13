import { Cart } from '@app/common';
import { Types } from 'mongoose';

export const cartStub = (): Cart & { _id: string; userId: string } => {
  return {
    userId: '65c1e0d599d26b570e2cde75' as any,
    _id: '65c1e0d599d26b570e2cde76' as any,
    items: [
      {
        price: 12.99,
        productId: new Types.ObjectId('65c1e0d599d26b570e2cde78'),
        quantity: 1,
      },
      {
        price: 0.33,
        productId: new Types.ObjectId('65c1e0d599d26b570e2cde79'),
        quantity: 19,
      },
      {
        price: 123.0,
        productId: new Types.ObjectId('65c1e0d599d26b570e2cde80'),
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
