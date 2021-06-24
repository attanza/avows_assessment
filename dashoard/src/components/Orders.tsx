import moment from 'moment';
import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import useError from '../hooks/useError';
import useUrlAddress from '../hooks/useUrlAddress';
import { IOrder, IPaginatedOrder } from '../interaces/order.iterface';
import api from '../utils/api';
import Spinner from './Spinner';

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
  const parseError = useError();
  const [data, setData] = useState<IPaginatedOrder>();
  const [loading, setLoading] = useState(false);
  const { generateUrl, apply, setApply, page, setPage, limit, setLimit } = useUrlAddress();

  const fetchData = async () => {
    try {
      setLoading(true);
      const resp = await api.get(generateUrl('/orders'));
      setData(resp);
      setLoading(false);
      setApply(false);
    } catch (error) {
      setLoading(false);
      parseError(error);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apply, page, limit]);

  const handlePageChange = (page: number) => {
    setPage(page);
  };
  const handlePerRowsChange = (newPerPage: number, page: number) => {
    setPage(page);
    setLimit(newPerPage);
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
            progressPending={loading}
            paginationPerPage={limit}
            paginationRowsPerPageOptions={[10, 25, 50, 100]}
            progressComponent={<Spinner />}
          />
        )}
      </div>
    </div>
  );
};

export default Orders;
