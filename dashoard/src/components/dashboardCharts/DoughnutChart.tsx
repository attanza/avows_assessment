import { Doughnut } from 'react-chartjs-2';
interface ITopProductOrder {
  product_name: string;
  totalqty: string;
}
type Props = {
  data: ITopProductOrder[];
};

const DoughnutChart = ({ data }: Props) => {
  const doughnutData = {
    labels: [''],
    datasets: [
      {
        label: 'Top Product Ordered',
        data: [''],
        backgroundColor: [''],
        borderColor: [''],
        borderWidth: 1,
      },
    ],
  };

  const getRandomColor = () => {
    const r = () => (Math.random() * 256) >> 0;
    return `rgb(${r()}, ${r()}, ${r()}, 0.7)`;
  };

  doughnutData.labels = data.map((d: any) => d.product_name);
  doughnutData.datasets[0].data = data.map((d: any) => d.totalqty);
  const backgroundColor = data.map(() => getRandomColor());
  doughnutData.datasets[0].backgroundColor = backgroundColor;
  doughnutData.datasets[0].borderColor = backgroundColor;
  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">Top Product Ordered</h5>
        <Doughnut data={doughnutData} type="doughnut" />
      </div>
    </div>
  );
};

export default DoughnutChart;
