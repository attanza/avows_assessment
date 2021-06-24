import { IOrder } from './order.iterface';
import { IProduct } from './product.interface';

export interface IOrderItem {
  orderId: string;
  productId: string;
  price: number;
  qty: number;
  order: IOrder;
  product: IProduct;
}
