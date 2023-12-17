import { Injectable } from '@nestjs/common';

@Injectable()
export class OrdersService {
  createOrder() {
    throw new Error('Method not implemented.');
  }
  getHello(): string {
    return 'Hello World!';
  }
}
