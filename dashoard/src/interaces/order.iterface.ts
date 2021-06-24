import { IOrderItem } from './orderItem.interface';
import { IPagination } from './pagination.interface';

export interface IOrder {
  id: string;
  code: string;
  amount: string;
  orderItems: IOrderItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IPaginatedOrder {
  pagination: IPagination;
  docs: IOrder[];
}
