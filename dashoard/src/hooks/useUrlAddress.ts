import { useFiltering } from '../contexts/FilteringContext';

const useUrlAddress = () => {
  const {
    field,
    operator,
    fieldValue,
    apply,
    setApply,
    secondFieldValue,
    page,
    limit,
    setPage,
    setLimit,
  } = useFiltering();
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
    setApply(false);
    return url;
  };
  return { generateUrl, apply, setApply, page, setPage, limit, setLimit };
};

export default useUrlAddress;
