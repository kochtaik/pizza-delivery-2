import { Role } from '@app/common/shared-constants';
import { FullJwtPayload } from '../../auth.types';
import { Request } from 'express';

export const requestStub = (): Request & { user: FullJwtPayload } => {
  const stub: Partial<Request & { user: FullJwtPayload }> = {};
  stub.user = {
    email: 'test@example.com',
    exp: 1245,
    iat: 1000,
    roles: [Role.ADMIN],
    sub: '65c1e0d599d26b570e2cde77',
  };

  return stub as Request & { user: FullJwtPayload };
};
