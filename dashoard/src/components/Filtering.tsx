import { useState } from 'react';
import { useFiltering } from '../contexts/FilteringContext';

const initialOperators = ['Select operator ...', 'eq', 'like', 'between'];

const Filtering = () => {
  const { field, operator, fieldValue, secondFieldValue, dispatch, clearFilter } = useFiltering();

  const [operators, setOperators] = useState(initialOperators);

  const getOperators = (e: any): void => {
    const field = e.target.value;
    dispatch({ type: 'set-field', payload: field });
    switch (field) {
      case 'amount':
        return setOperators(['Select operator ...', 'eq', 'between']);
      case 'code':
        return setOperators(['Select operator ...', 'like', 'eq']);
      case 'createdAt':
        return setOperators(['Select operator ...', 'between']);
      default:
        return setOperators(initialOperators);
    }
  };

  const getInputType = () => {
    switch (field) {
      case 'amount':
        return 'number';
      case 'createdAt':
        return 'date';
      default:
        return 'text';
    }
  };

  const applyFilter = () => {
    dispatch({ type: 'set-apply', payload: true });
  };

  return (
    <div>
      <li className="mt-2">
        <select className="form-control" onChange={getOperators} value={field}>
          <option value="">Select field ...</option>
          <option value="code">Code</option>
          <option value="amount">Amount</option>
          <option value="createdAt">Date</option>
        </select>
      </li>
      <li className="mt-2">
        <select
          className="form-control"
          onChange={(e: any) => dispatch({ type: 'set-operator', payload: e.target.value })}
          value={operator}>
          {operators.map((o: string) => (
            <option value={o} key={o}>
              {o}
            </option>
          ))}
        </select>
      </li>
      {(operator === 'eq' || operator === 'like' || operator === 'between') && (
        <li className="mt-2">
          <input
            className="form-control"
            value={fieldValue}
            onChange={(e: any) => dispatch({ type: 'set-fieldValue', payload: e.target.value })}
            type={getInputType()}
          />
        </li>
      )}
      {operator === 'between' && (
        <li className="mt-2">
          <input
            className="form-control"
            value={secondFieldValue}
            onChange={(e: any) =>
              dispatch({ type: 'set-secondFieldValue', payload: e.target.value })
            }
            type={getInputType()}
          />
        </li>
      )}

      <li className="mt-2">
        <button className="btn btn-info btn-block" onClick={applyFilter}>
          Apply
        </button>
      </li>
      <li className="mt-2">
        <button className="btn btn-outline-primary btn-block" onClick={clearFilter}>
          Clear
        </button>
      </li>
    </div>
  );
};

export default Filtering;
