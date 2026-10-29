import { Body, Controller, Post } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderReceipt, OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Throttle({ default: { limit: 10, ttl: 10 * 60_000 } })
  @Post()
  create(@Body() dto: CreateOrderDto): Promise<OrderReceipt> {
    return this.ordersService.create(dto);
  }
}
