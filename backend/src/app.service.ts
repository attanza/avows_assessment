import { Injectable } from '@nestjs/common';
import faker from 'faker';
import { customAlphabet } from 'nanoid';

import { OrderItemsService } from './order-items/order-items.service';
import { OrdersService } from './orders/orders.service';
import { ProductCategoriesService } from './product-categories/product-categories.service';
import ProductCategory from './product-categories/product-category.entity';
import Product from './products/product.entity';
import { ProductsService } from './products/products.service';
import User from './users/user.entity';
import { UsersService } from './users/users.service';

@Injectable()
export class AppService {
  constructor(
    private readonly userService: UsersService,
    private readonly productCategoriesService: ProductCategoriesService,
    private readonly productsService: ProductsService,
    private readonly ordersService: OrdersService,
    private readonly orderItemsService: OrderItemsService
  ) {}
  getHello(): string {
    return 'Hello World!';
  }

  async seed(): Promise<void> {
    await Promise.all([
      // this.userService.deleteBy({}),
      this.productCategoriesService.deleteBy({}),
      this.productsService.deleteBy({}),
      this.orderItemsService.deleteBy({}),
      this.ordersService.deleteBy({}),
    ]);

    await Promise.all([
      // this.userService.insertMany(this.generateUserData()),
      this.productCategoriesService.insertMany(this.generateProductCategory()),
    ]);
    const nanoid = customAlphabet('1234567890ABCDEF', 10);
    await this.productsService.insertMany(await this.generateProductData());
    const products = await this.productsService.find({});
    const orderItemsData: any[] = [];
    for (let i = 0; i < 500; i++) {
      const productToOrder: Product[] = [];
      const itemCount = faker.datatype.number({ min: 1, max: 5 });
      Array.from({ length: itemCount }).map(() => {
        productToOrder.push(
          products[faker.datatype.number(products.length - 1)]
        );
      });
      let amount = 0;
      const qty = faker.datatype.number({ min: 1, max: 5 });
      productToOrder.map((product) => (amount = amount + qty * product.price));
      const order = await this.ordersService.create({
        code: nanoid(),
        amount,
        createdAt: `2021 ${faker.datatype.number({
          min: 1,
          max: 6,
        })} ${faker.datatype.number({ min: 1, max: 28 })} `,
      });
      productToOrder.map((product) =>
        orderItemsData.push({
          orderId: order.id,
          productId: product.id,
          price: product.price,
          qty,
        })
      );
    }
    await this.orderItemsService.insertMany(orderItemsData);
  }

  private generateUserData() {
    const password =
      '$argon2i$v=19$m=4096,t=3,p=1$kPtmmMf4JKUpYDaE+5KAQg$lTC0a5q+SjSGRnrVQca6bJhWfqy1CJ5VLE0ooHH61lc';
    const users: Array<Partial<User>> = [
      {
        name: 'Dani',
        email: 'dani.lesmiadi@gmail.com',
        password,
      },
    ];
    for (let i = 0; i < 5; i++) {
      users.push({
        name: faker.name.findName(),
        email: faker.internet.email(),
        password,
      });
    }
    return users;
  }

  private generateProductCategory() {
    const data = [];
    for (let i = 0; i < 2; i++) {
      data.push({
        name: faker.lorem.word(),
      });
    }
    return data;
  }

  private async generateProductData() {
    const categories = await this.productCategoriesService.find({});
    const data: Array<Partial<Product>> = [];

    categories.map((category: ProductCategory) => {
      for (let i = 0; i < 2; i++) {
        data.push({
          name: faker.commerce.productName(),
          category: category.id,
          price: Number(faker.commerce.price()) * 100,
        });
      }
    });
    return data;
  }
}
