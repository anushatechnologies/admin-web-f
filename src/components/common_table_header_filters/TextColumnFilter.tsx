import React from 'react';
import TextInput from '@components/common/TextInput';
import { useDispatch } from 'react-redux';
import _ from 'lodash';

interface TextColumnFilterProps {
  column: any;
  filters: any;
  setFilters: any;
}
const TextColumnFilter = ({ column, filters, setFilters }: TextColumnFilterProps) => {
  const dispatch = useDispatch();
  const filterChangeHandler = (event: any) => {
    if (Object.keys(filters).length !== 0) {
      const value = event.target.value;
      const filtersData = _.cloneDeep(filters);
      filtersData[column.key] = value;
      dispatch(setFilters(filtersData));
    }
  };
  return (
    <div>
      <TextInput
        label={column.label}
        name={column.key}
        dataInput={column.dataInput}
        onChange={filterChangeHandler}
        value={filters[column.key]}
      />
    </div>
  );
};

export default TextColumnFilter;
