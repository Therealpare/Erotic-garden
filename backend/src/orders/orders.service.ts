import { BadRequestException, Injectable } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { ProductsService } from '../products/products.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order, OrderItem } from './entities/order.entity';

/** In-memory store — replace with a real repository in Phase 5. No payment gateway yet; every order is created PENDING. */
const ORDERS: Order[] = [];
let nextId = 1;

@Injectable()
export class OrdersService {
  constructor(private readonly productsService: ProductsService) {}

  create(dto: CreateOrderDto): Order {
    const items: OrderItem[] = dto.items.map((line) => {
      const product = this.productsService.findById(line.productId);
      if (!product) {
        throw new BadRequestException(`Product with id ${line.productId} does not exist`);
      }
      if (!product.available) {
        throw new BadRequestException(`Product "${product.name}" is not currently available`);
      }
      return {
        productId: product.id,
        name: product.name,
        size: product.size,
        price: product.price,
        quantity: line.quantity,
      };
    });

    const currency = items.length > 0 ? this.productsService.findById(items[0].productId)!.currency : 'THB';
    const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const now = new Date();
    const order: Order = {
      id: nextId++,
      orderNumber: this.generateOrderNumber(),
      name: dto.name,
      phone: dto.phone,
      address: dto.address,
      contactChannel: dto.contactChannel,
      items,
      totalAmount,
      currency,
      status: 'PENDING',
      createdAt: now,
      updatedAt: now,
    };

    ORDERS.push(order);
    return order;
  }

  findAll(): Order[] {
    return ORDERS;
  }

  private generateOrderNumber(): string {
    const random = randomBytes(4).toString('hex').toUpperCase();
    return `EGC-${random}`;
  }
}
