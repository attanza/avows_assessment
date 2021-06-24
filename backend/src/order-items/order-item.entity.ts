import BaseIdEntity from 'src/database/base-id.entity';
import Order from 'src/orders/order.entity';
import Product from 'src/products/product.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity('order_items')
class OrderItem extends BaseIdEntity {
  @Column()
  public orderId: string;

  @Column()
  public productId: string;

  @Column({ type: 'int' })
  public price: number;

  @Column({ type: 'int' })
  public qty: number;

  @ManyToOne(() => Order, (order) => order.orderItems)
  public order: Order;

  @ManyToOne(() => Product, (product) => product.orderItems)
  public product: Product;
}

export default OrderItem;
