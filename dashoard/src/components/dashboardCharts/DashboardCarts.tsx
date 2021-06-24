import useSWR from 'swr';
import useError from '../../hooks/useError';
import Spinner from '../Spinner';
import DoughnutChart from './DoughnutChart';
import LineChart from './LineChart';
const DashboardCarts = () => {
  const parseError = useError();
  const { data, error } = useSWR('/orders/orders-dashboard');
  if (error) {
    parseError(error);
  }
  if (!data) {
    return <Spinner />;
  }

  return (
    <div className="row">
      <div className="col-6">
        <DoughnutChart data={data.topProductsOrdered}></DoughnutChart>
      </div>
      <div className="col-6">
        <LineChart data={data.monthlyOrders}></LineChart>
      </div>
    </div>
  );
};

export default DashboardCarts;
