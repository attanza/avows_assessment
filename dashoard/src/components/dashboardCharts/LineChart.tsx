import React from 'react';
import moment from 'moment';
import { Line } from 'react-chartjs-2';
interface IMonthlyOrder {
  total: string;
  month: number;
}
type Props = {
  data: IMonthlyOrder[];
};
const LineChart = ({ data }: Props) => {
  const lineData = {
    labels: ['1', '2', '3', '4', '5', '6'],
    datasets: [
      {
        label: 'Revenue',
        data: [''],
        fill: false,
        backgroundColor: '#3498db',
        borderColor: '#2980b9',
      },
    ],
  };

  const options = {
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
  };

  lineData.labels = data.map((d: IMonthlyOrder) => moment.months(d.month - 1));
  lineData.datasets[0].data = data.map((d: IMonthlyOrder) => d.total);
  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">Monthly Revenue</h5>
        <Line data={lineData} options={options} type="bar" />
      </div>
    </div>
  );
};

export default React.memo(LineChart);
