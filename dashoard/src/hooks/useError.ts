import { useHistory } from 'react-router-dom';

const useError = () => {
  const history = useHistory();
  const parseError = async (error: any) => {
    if (error.response) {
      const status = error.response.status;
      if (status === 401) {
        history.replace('/login');
      }
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      console.log('request:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log('Error', error.message);
    }
  };
  return parseError;
};
export default useError;
