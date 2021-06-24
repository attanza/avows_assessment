import { useHistory } from 'react-router-dom';

const useError = () => {
  const history = useHistory();
  const parseError = async (error: any) => {
    if (error.response) {
      const status = error.response.status;
      if (status === 401) {
        history.push('/login');
      }
    }
  };
  return parseError;
};
export default useError;
