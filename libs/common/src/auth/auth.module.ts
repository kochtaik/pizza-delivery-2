import { Module } from '@nestjs/common';
import { AUTH_SERVICE } from '../shared-constants';
import { RmqModule } from '../rmq';

@Module({
  imports: [RmqModule.register({ name: AUTH_SERVICE })],
  exports: [RmqModule],
})
/**
 * A module that serves as a wrapper for the RmqModule.
 * It provides a guard for JWT, forwarding the request to the auth service.
 */
export class AuthModule {}
