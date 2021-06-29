import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';
import useError from './useError';

function useAxios<T>(url: string, signals: Array<any> = []) {
  const theRequest = api.cancel();
  const parseError = useError();
  const { authLoading } = useAuth();
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    async function getData() {
      try {
        setLoading(true);
        const resp = await api.get(url, { cancelToken: theRequest.token });
        setData(resp);
        setLoading(false);
      } catch (error) {
        if (api.isCancel(error)) {
          console.log('axios aborted');
        } else {
          setLoading(false);
          parseError(error);
        }
      }
    }
    if (!authLoading) {
      getData();
    }
    return () => theRequest.cancel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...signals, authLoading]);
  return { data, loading };
}

export default useAxios;
