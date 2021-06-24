import DashboardCarts from '../components/dashboardCharts/DashboardCarts';
import Layout from '../components/Layout';
import Orders from '../components/Orders';
const Dashboard = () => {
  return (
    <Layout>
      <DashboardCarts />
      <Orders />
    </Layout>
  );
};

export default Dashboard;
