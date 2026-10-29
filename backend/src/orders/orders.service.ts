import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { randomBytes } from 'crypto';
import { DataSource, In } from 'typeorm';
import { LineService } from '../notifications/line.service';
import { ProductVariant } from '../products/entities/product-variant.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderItem } from './entities/order-item.entity';
import { Order } from './entities/order.entity';

export interface OrderReceipt {
  orderNumber: string;
  status: Order['status'];
  totalAmount: number;
  currency: string;
}

export interface StockProblem {
  variantId: number;
  /** Units still available (0 when sold out or no longer sold). */
  available: number;
}

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly line: LineService,
  ) {}

  /**
   * Creates an order and takes the stock in one transaction. The size rows are locked
   * (SELECT … FOR UPDATE, in id order to avoid deadlocks) so two shoppers can never buy
   * the same last bag; a CHECK constraint keeps stock from going negative regardless.
   */
  async create(dto: CreateOrderDto): Promise<OrderReceipt> {
    const quantities = new Map<number, number>();
    for (const line of dto.items)
      quantities.set(
        line.variantId,
        (quantities.get(line.variantId) ?? 0) + line.quantity,
      );
    const variantIds = [...quantities.keys()].sort((a, b) => a - b);

    const order = await this.dataSource.transaction(async (manager) => {
      const variants = await manager
        .createQueryBuilder(ProductVariant, 'v')
        .innerJoinAndSelect('v.product', 'p')
        .where({ id: In(variantIds) })
        .orderBy('v.id', 'ASC')
        .setLock('pessimistic_write', undefined, ['v'])
        .getMany();
      const byId = new Map(variants.map((variant) => [variant.id, variant]));

      const problems: StockProblem[] = [];
      for (const id of variantIds) {
        const variant = byId.get(id);
        const sellable =
          variant &&
          variant.status === 'ACTIVE' &&
          variant.product.status === 'ACTIVE';
        const available = sellable ? variant.stock : 0;
        if (available < quantities.get(id)!)
          problems.push({ variantId: id, available });
      }
      if (problems.length) {
        throw new ConflictException({
          message: 'Some items are sold out or not available in that quantity',
          items: problems,
        });
      }

      const currencies = new Set(variants.map((variant) => variant.currency));
      if (currencies.size > 1)
        throw new BadRequestException(
          'All items in one order must use the same currency',
        );

      for (const id of variantIds) {
        await manager.decrement(
          ProductVariant,
          { id },
          'stock',
          quantities.get(id)!,
        );
      }

      const items = variantIds.map((id) => {
        const variant = byId.get(id)!;
        return manager.create(OrderItem, {
          variantId: id,
          productName: variant.product.name.en,
          variantLabel: variant.label,
          unitPrice: variant.price,
          quantity: quantities.get(id)!,
        });
      });
      const total = items.reduce(
        (sum, item) => sum + item.unitPrice * item.quantity,
        0,
      );

      return manager.save(
        manager.create(Order, {
          orderNumber: this.generateOrderNumber(),
          name: dto.name.trim(),
          phone: dto.phone.trim(),
          address: dto.address.trim(),
          contactChannel: dto.contactChannel.trim(),
          totalAmount: Math.round(total * 100) / 100,
          currency: variants[0].currency,
          items,
        }),
      );
    });

    // The order is committed; a LINE failure must never undo it or delay the shopper.
    void this.notifyStaff(order);
    return {
      orderNumber: order.orderNumber,
      status: order.status,
      totalAmount: order.totalAmount,
      currency: order.currency,
    };
  }

  private async notifyStaff(order: Order): Promise<void> {
    const lines = [
      `☕ New coffee order ${order.orderNumber}`,
      ...order.items.map(
        (item) =>
          `• ${item.productName} ${item.variantLabel} × ${item.quantity} = ${item.unitPrice * item.quantity} ${order.currency}`,
      ),
      `Total: ${order.totalAmount} ${order.currency}`,
      '',
      `Name: ${order.name}`,
      `Phone: ${order.phone}`,
      `Contact: ${order.contactChannel}`,
      `Address: ${order.address}`,
    ];
    if (await this.line.pushToAdmin(lines.join('\n'))) {
      await this.dataSource
        .getRepository(Order)
        .update(order.id, { lineNotifiedAt: new Date() })
        .catch((error) =>
          this.logger.error(
            `Could not record LINE notification: ${error.message}`,
          ),
        );
    }
  }

  private generateOrderNumber(): string {
    return `EGC-${randomBytes(4).toString('hex').toUpperCase()}`;
  }
}
