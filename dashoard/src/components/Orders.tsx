import moment from 'moment';
import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { useAuth } from '../contexts/AuthContext';
import useError from '../hooks/useError';
import useUrlAddress from '../hooks/useUrlAddress';
import { IOrder, IPaginatedOrder } from '../interaces/order.iterface';
import api from '../utils/api';

const columns = [
  {
    name: 'Code',
    selector: 'code',
    sortable: true,
  },
  {
    name: 'Amount',
    selector: 'amount',
    sortable: true,
  },
  {
    name: 'Date',
    selector: 'createdAt',
    sortable: true,
    cell: (row: IOrder) => moment(row.createdAt).format('DD MMMM YYYY'),
  },
];

const Orders = () => {
  const theRequest = api.cancel();
  const parseError = useError();
  const { authLoading } = useAuth();
  const [data, setData] = useState<IPaginatedOrder | null>(null);
  const { generateUrl, apply, page, limit, dispatch } = useUrlAddress();

  const fetchData = async () => {
    try {
      const resp = await api.get(generateUrl('/orders'), { cancelToken: theRequest.token });
      setData(resp);
    } catch (error) {
      if (api.isCancel(error)) {
        console.log('get orders aborted');
      } else {
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
  }, [apply, page, limit, authLoading]);

  const handlePageChange = (page: number) => {
    dispatch({ type: 'set-page', payload: page });
  };
  const handlePerRowsChange = (newPerPage: number, page: number) => {
    dispatch({ type: 'set-page', payload: page });
    dispatch({ type: 'set-limit', payload: newPerPage });
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Orders</h3>
      </div>
      <div className="card-body">
        {data && (
          <DataTable
            noHeader
            responsive
            columns={columns}
            data={data.docs}
            pagination
            paginationServer
            paginationTotalRows={data.pagination.totalDocs}
            onChangeRowsPerPage={handlePerRowsChange}
            onChangePage={handlePageChange}
            paginationPerPage={limit}
            paginationRowsPerPageOptions={[10, 25, 50, 100]}
          />
        )}
      </div>
    </div>
  );
};

export default Orders;
