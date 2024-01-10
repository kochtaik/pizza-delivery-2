import { Role } from '../shared-constants';

export interface BaseJwtPayload {
  sub: string;
  email: string;
  roles: Array<Role>;
}

export interface FullJwtPayload extends BaseJwtPayload {
  iat: number;
  exp: number;
}
