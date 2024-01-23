import { Request } from 'express';

export function extractBaseUrlFromRequest(request: Request) {
  const protocol = request.protocol;
  const host = request.get('host');
  return `${protocol}://${host}`;
}
