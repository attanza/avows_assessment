export interface IMonthlyOrders {
  month: number;
  total: string;
}

export interface ITopProductsOrdered {
  product_name: string;
  totalqty: string;
}

export interface IOrdersDashboard {
  monthlyOrders: Array<IMonthlyOrders>;
  topProductsOrdered: Array<ITopProductsOrdered>;
}
