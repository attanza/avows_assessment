import { useFiltering } from '../contexts/FilteringContext';

const useUrlAddress = () => {
  const { field, operator, fieldValue, apply, secondFieldValue, page, limit, dispatch } =
    useFiltering();
  const generateUrl = (baseUrl: string): string => {
    let url = `${baseUrl}?page=${page}&limit=${limit}`;
    if (field && fieldValue && operator === 'like') {
      url = url + `&regexKey=${field}&regexValue=${fieldValue}`;
    }
    if (field && fieldValue && operator === 'eq') {
      url = url + `&fieldKey=${field}&fieldValue=${fieldValue}`;
    }
    if (field && fieldValue && secondFieldValue && operator === 'between') {
      url = url + `&between=${field},${fieldValue},${secondFieldValue}`;
    }
    dispatch({ type: 'set-apply', payload: false });
    return url;
  };
  return { generateUrl, apply, dispatch, page, limit };
};

export default useUrlAddress;
