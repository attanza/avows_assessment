import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import BaseRepo from 'src/database/base-repo';
import { Repository } from 'typeorm';
import ProductCategory from './product-category.entity';

@Injectable()
export class ProductCategoriesService extends BaseRepo<ProductCategory> {
  constructor(
    @InjectRepository(ProductCategory)
    private repository: Repository<ProductCategory>,
  ) {
    super(repository);
  }
}
