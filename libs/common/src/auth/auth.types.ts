export interface BaseJwtPayload {
  sub: string;
  email: string;
}

export interface FullJwtPayload extends BaseJwtPayload {
  iat: number;
  exp: number;
}
