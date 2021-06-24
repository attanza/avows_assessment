import BaseIdEntity from 'src/database/base-id.entity';
import OrderItem from 'src/order-items/order-item.entity';
import ProductCategory from 'src/product-categories/product-category.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

@Entity('products')
class Product extends BaseIdEntity {
  @Column({ unique: true })
  public name: string;

  @Column({ type: 'int' })
  public price: number;

  @ManyToOne(() => ProductCategory, (category) => category.products, {
    eager: true,
  })
  category: string | ProductCategory;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.product)
  public orderItems: OrderItem[];
}

export default Product;
