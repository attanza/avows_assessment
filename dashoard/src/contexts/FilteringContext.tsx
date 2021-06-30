import React, { createContext, useContext, useReducer } from 'react';
import { IReducerAction } from '../interaces/reducers.interface';

type FilteringContextType = {
  field: string;
  operator: string;
  fieldValue: string | number;
  secondFieldValue: string | number;
  apply: boolean;
  page: number;
  limit: number;
  dispatch: (value: IReducerAction) => void;
  clearFilter: () => void;
  resetFieldValues: () => void;
};

const initialValue: FilteringContextType = {
  field: '',
  operator: '',
  fieldValue: '',
  secondFieldValue: '',
  page: 1,
  limit: 10,
  apply: false,
  dispatch: (value: IReducerAction) => {},
  clearFilter: () => {},
  resetFieldValues: () => {},
};

const filteringReducer = (
  state: FilteringContextType,
  action: IReducerAction
) => {
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
    case 'reset-fieldValues':
      return {
        ...state,
        operator: '',
        fieldValue: '',
        secondFieldValue: '',
        apply: false,
      };
    default:
      return state;
  }
};

const FilteringContext = createContext(initialValue);

const FilteringProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(filteringReducer, initialValue);
  const clearFilter = () => dispatch({ type: 'clear-filter' });
  const resetFieldValues = () => dispatch({ type: 'reset-fieldValues' });

  return (
    <FilteringContext.Provider
      value={{ ...state, dispatch, clearFilter, resetFieldValues }}>
      {children}
    </FilteringContext.Provider>
  );
};

export default FilteringProvider;

export function useFiltering() {
  return useContext(FilteringContext);
}
