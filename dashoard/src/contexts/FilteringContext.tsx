import React, { createContext, useContext, useReducer } from 'react';

type Action = {
  type: string;
  payload?: any;
};
type FilteringContextType = {
  field: string;
  operator: string;
  fieldValue: string | number;
  secondFieldValue: string | number;
  apply: boolean;
  page: number;
  limit: number;
  dispatch: (value: Action) => void;
  clearFilter: () => void;
};

const initialValue: FilteringContextType = {
  field: '',
  operator: '',
  fieldValue: '',
  secondFieldValue: '',
  page: 1,
  limit: 10,
  apply: false,
  dispatch: (value: Action) => {},
  clearFilter: () => {},
};

const filteringReducer = (state: FilteringContextType, action: Action) => {
  switch (action.type) {
    case 'set-field':
      return { ...state, field: action.payload };
    case 'set-operator':
      return { ...state, operator: action.payload };
    case 'set-fieldValue':
      return { ...state, fieldValue: action.payload };
    case 'set-secondFieldValue':
      return { ...state, secondFieldValue: action.payload };
    case 'set-page':
      return { ...state, page: action.payload };
    case 'set-limit':
      return { ...state, limit: action.payload };
    case 'set-apply':
      return { ...state, apply: action.payload };
    case 'clear-filter':
      return {
        ...state,
        field: '',
        operator: '',
        fieldValue: '',
        secondFieldValue: '',
        apply: true,
      };
    default:
      return state;
  }
};

const FilteringContext = createContext(initialValue);

const FilteringProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(filteringReducer, initialValue);
  const clearFilter = () => dispatch({ type: 'clear-filter' });
  return (
    <FilteringContext.Provider value={{ ...state, dispatch, clearFilter }}>
      {children}
    </FilteringContext.Provider>
  );
};

export default FilteringProvider;

export function useFiltering() {
  return useContext(FilteringContext);
}
