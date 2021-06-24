import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import BaseRepo from 'src/database/base-repo';
import { Repository } from 'typeorm';
import Product from './product.entity';

@Injectable()
export class ProductsService extends BaseRepo<Product> {
  constructor(
    @InjectRepository(Product)
    private repository: Repository<Product>,
  ) {
    super(repository);
  }
}
