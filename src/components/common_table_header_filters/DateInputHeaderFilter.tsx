import React from 'react';
import DateInput from '@components/common/DateInput';
import { useDispatch } from 'react-redux';
import _ from 'lodash';

interface DateInputHeaderFilterProps {
  column: any;
  filters?: any;
  setFilters?: any;
}
const DateInputHeaderFilter = ({ column, filters, setFilters }: DateInputHeaderFilterProps) => {
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
      <DateInput name={column.key} label={column.label} onChange={filterChangeHandler} />
    </div>
  );
};

export default DateInputHeaderFilter;
