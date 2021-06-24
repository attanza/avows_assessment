import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SWRConfig } from 'swr';
import './App.css';
import Routes from './Routes';
import api from './utils/api';

function App() {
  return (
    <div>
      <SWRConfig
        value={{
          fetcher: (url) => api.get(url),
        }}>
        <Routes></Routes>
      </SWRConfig>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default App;
