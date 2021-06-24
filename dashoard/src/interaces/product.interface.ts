import { IOrderItem } from './orderItem.interface';
import { IProductCategory } from './productCategory.interface';

export interface IProduct {
  name: string;
  price: number;
  category: IProductCategory;
  orderItems: IOrderItem[];
}
