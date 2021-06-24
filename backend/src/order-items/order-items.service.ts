import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import BaseRepo from 'src/database/base-repo';
import { Repository } from 'typeorm';
import OrderItem from './order-item.entity';

@Injectable()
export class OrderItemsService extends BaseRepo<OrderItem> {
  constructor(
    @InjectRepository(OrderItem)
    private repository: Repository<OrderItem>,
  ) {
    super(repository);
  }
}
