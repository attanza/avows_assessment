import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import useError from '../../hooks/useError';
import useUrlAddress from '../../hooks/useUrlAddress';
import { IOrdersDashboard } from '../../interaces/orders-dashboard.interface';
import api from '../../utils/api';
import DoughnutChart from './DoughnutChart';
import LineChart from './LineChart';
const DashboardCarts = () => {
  const theRequest = api.cancel();
  const parseError = useError();
  const { authLoading } = useAuth();
  const [data, setData] = useState<IOrdersDashboard | null>(null);
  const { generateUrl, apply } = useUrlAddress();

  const fetchData = async () => {
    try {
      const resp = await api.get(generateUrl('/orders/orders-dashboard'), {
        cancelToken: theRequest.token,
      });
      setData(resp);
    } catch (error) {
      if (!api.isCancel(error)) {
        parseError(error);
      }
    }
  };

  useEffect(() => {
    if (!authLoading) {
      fetchData();
    }
    return () => theRequest.cancel();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apply, authLoading]);
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
