import useAxios from '../../hooks/useAxios';
import { IOrdersDashboard } from '../../interaces/orders-dashboard.interface';
import Spinner from '../Spinner';
import DoughnutChart from './DoughnutChart';
import LineChart from './LineChart';
const DashboardCarts = () => {
  const { data, loading } = useAxios<IOrdersDashboard>('/orders/orders-dashboard');

  if (loading) {
    return <Spinner />;
  }
  return (
    <div className="row">
      {data && (
        <>
          <div className="col-6">
            <DoughnutChart data={data?.topProductsOrdered}></DoughnutChart>
          </div>
          <div className="col-6">
            <LineChart data={data.monthlyOrders}></LineChart>
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardCarts;
