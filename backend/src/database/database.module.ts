import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import User from 'src/users/user.entity';
import ProductCategory from 'src/product-categories/product-category.entity';
import Product from 'src/products/product.entity';
import Order from 'src/orders/order.entity';
import OrderItem from 'src/order-items/order-item.entity';
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        name: 'default',
        type: 'postgres',
        host: configService.get('POSTGRES_HOST'),
        port: configService.get('POSTGRES_PORT'),
        username: configService.get('POSTGRES_USER'),
        password: configService.get('POSTGRES_PASSWORD'),
        database: configService.get('POSTGRES_DB'),
        entities: [User, ProductCategory, Product, Order, OrderItem],
        synchronize: true,
        logging: true,
      }),
    }),
  ],
})
export class DatabaseModule {}
