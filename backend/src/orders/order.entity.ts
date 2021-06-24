import BaseIdEntity from 'src/database/base-id.entity';
import OrderItem from 'src/order-items/order-item.entity';
import { BeforeInsert, Column, Entity, OneToMany } from 'typeorm';
import { customAlphabet } from 'nanoid';
const nanoid = customAlphabet('1234567890ABCDEF', 10);

@Entity('orders')
class Order extends BaseIdEntity {
  @Column({ unique: true })
  public code: string;

  @Column({ type: 'int' })
  public amount: number;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
  public orderItems: OrderItem[];

  @BeforeInsert()
  generateCode() {
    this.code = nanoid();
  }
}

export default Order;
