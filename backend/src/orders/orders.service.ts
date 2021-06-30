import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import BaseRepo from 'src/database/base-repo';
import { OrderItemsService } from 'src/order-items/order-items.service';
import Product from 'src/products/product.entity';
import { ProductsService } from 'src/products/products.service';
import { PaginationParams } from 'src/utils/paginationParams';
import { Redis } from 'src/utils/redis';
import { In, Repository } from 'typeorm';
import crypto from 'crypto';

import Order from './order.entity';
import { CreateOrderDto } from './orders.dto';

@Injectable()
export class OrdersService extends BaseRepo<Order> {
  constructor(
    @InjectRepository(Order)
    private repository: Repository<Order>,
    private readonly productService: ProductsService,
    private readonly orderItemsService: OrderItemsService
  ) {
    super(repository);
  }

  async createOrder(data: CreateOrderDto): Promise<Order> {
    // check products is exist
    const products = await this.getProductsFromIds(data);

    // calculate amount
    const amount = this.calculateAmount(products, data);

    // create order
    const order = await this.create({ amount });

    // create order items
    await this.insertOrderItems(products, data, order);

    return this.show(order.id, ['orderItems', 'orderItems.product']);
  }

  async updateOrder(id: string, data: CreateOrderDto): Promise<Order> {
    const order = await this.findOne(id);
    if (!order) {
      throw new BadRequestException('Order not found');
    }
    // check products is exist
    const products = await this.getProductsFromIds(data);

    // calculate amount
    const amount = this.calculateAmount(products, data);

    order.amount = amount;
    await Promise.all([
      order.save(),
      this.orderItemsService.deleteBy({ orderId: order.id }),
    ]);
    await this.insertOrderItems(products, data, order);
    return this.show(order.id, ['orderItems', 'orderItems.product']);
  }

  async deleteOrder(id: string): Promise<void> {
    const order = await this.findOne(id);
    if (!order) {
      throw new BadRequestException('Order not found');
    }
    await Promise.all([
      this.orderItemsService.deleteBy({ orderId: order.id }),
      this.delete(id),
    ]);
  }

  private async insertOrderItems(
    products: Product[],
    data: CreateOrderDto,
    order: Order
  ) {
    const orderItems = [];
    for (const p of products) {
      const prod = data.items.find((i) => i.productId === p.id);
      orderItems.push({
        orderId: order.id,
        productId: p.id,
        qty: prod.qty,
        price: p.price,
      });
    }
    await this.orderItemsService.insertMany(orderItems);
  }

  private async getProductsFromIds(data: CreateOrderDto) {
    const productIds: string[] = [];
    data.items.map((i) => productIds.push(i.productId));
    const products = await this.productService.find({
      where: { id: In(productIds) },
    });
    if (productIds.length !== products.length) {
      throw new BadRequestException('One or more id does not exists!');
    }
    return products;
  }

  private calculateAmount(products: any, data: CreateOrderDto) {
    let amount = 0;
    products.map((p: Product) => {
      const prod = data.items.find((i) => i.productId === p.id);
      amount = amount + prod.qty * p.price;
    });
    return amount;
  }

  async getForDashboard(query: PaginationParams) {
    const redisKey =
      'Order_For_Dashboard_' +
      crypto.createHash('md5').update(JSON.stringify(query)).digest('hex');
    const cache = await Redis.get(redisKey);
    if (cache) {
      return cache;
    }

    const monthlyOrdersQB = this.repository
      .createQueryBuilder('order')
      .select('SUM(order.amount) as total')
      .addSelect('extract(month from order.createdAt) as month')
      .groupBy('month')
      .orderBy('month');

    const topProductsOrderedQB = this.repository
      .createQueryBuilder('order')
      .select(['product.name'])
      .addSelect('SUM(qty) as totalQty')
      .leftJoin('order.orderItems', 'orderItems')
      .leftJoin('orderItems.product', 'product')
      .groupBy('product.name')
      .orderBy('totalQty', 'DESC');

    if (query.between) {
      const betweenSplit = query.between.split(',');
      if (betweenSplit[0] === 'createdAt') {
        monthlyOrdersQB.where(`order.createdAt >= :after`, {
          after: betweenSplit[1],
        });
        monthlyOrdersQB.andWhere(`order.createdAt <= :before`, {
          before: betweenSplit[2],
        });
        topProductsOrderedQB.where(`order.createdAt >= :after`, {
          after: betweenSplit[1],
        });
        topProductsOrderedQB.andWhere(`order.createdAt <= :before`, {
          before: betweenSplit[2],
        });
      }
    }

    const [monthlyOrders, topProductsOrdered] = await Promise.all([
      monthlyOrdersQB.getRawMany(),
      topProductsOrderedQB.getRawMany(),
    ]);
    await Redis.set(redisKey, { monthlyOrders, topProductsOrdered });

    return { monthlyOrders, topProductsOrdered };
  }
}
