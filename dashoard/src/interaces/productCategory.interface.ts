import { IProduct } from './product.interface';

export interface IProductCategory {
  name: string;
  products: IProduct[];
}
