import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { ClientProxy } from '@nestjs/microservices';
import { AUTH_SERVICE } from '../shared-constants';
import { lastValueFrom } from 'rxjs';
import { FullJwtPayload } from './auth.types';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(@Inject(AUTH_SERVICE) private readonly client: ClientProxy) { }

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload = await lastValueFrom(
        this.client.send<FullJwtPayload, string>('verify', token),
      );

      return !!payload;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      return;
    }

    const [type, token] = authHeader.split(' ');
    if (type !== 'Bearer') {
      return;
    }

    return token;
  }
}
