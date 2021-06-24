import React, { createContext, useContext, useState } from 'react';

type FilteringContextType = {
  field: string;
  setField: React.Dispatch<React.SetStateAction<string>>;
  operator: string;
  setOperator: React.Dispatch<React.SetStateAction<string>>;
  fieldValue: string | number;
  setFieldValue: React.Dispatch<React.SetStateAction<string | number>>;
  secondFieldValue: string | number;
  setSecondFieldValue: React.Dispatch<React.SetStateAction<string | number>>;
  apply: boolean;
  setApply: React.Dispatch<React.SetStateAction<boolean>>;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  limit: number;
  setLimit: React.Dispatch<React.SetStateAction<number>>;
};

const initialValue: FilteringContextType = {
  field: '',
  operator: '',
  fieldValue: '',
  secondFieldValue: '',
  page: 1,
  limit: 10,
  apply: false,
  setField: () => {},
  setOperator: () => {},
  setFieldValue: () => {},
  setSecondFieldValue: () => {},
  setApply: () => {},
  setPage: () => {},
  setLimit: () => {},
};

const FilteringContext = createContext(initialValue);

const FilteringProvider: React.FC = ({ children }) => {
  const [field, setField] = useState('');
  const [operator, setOperator] = useState('');
  const [fieldValue, setFieldValue] = useState<string | number>('');
  const [secondFieldValue, setSecondFieldValue] = useState<string | number>('');
  const [apply, setApply] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  return (
    <FilteringContext.Provider
      value={{
        field,
        setField,
        operator,
        setOperator,
        fieldValue,
        setFieldValue,
        apply,
        setApply,
        secondFieldValue,
        setSecondFieldValue,
        page,
        setPage,
        limit,
        setLimit,
      }}>
      {children}
    </FilteringContext.Provider>
  );
};

export default FilteringProvider;

export function useFiltering() {
  return useContext(FilteringContext);
}
