import React from 'react';
import SelectInput from '@components/common/SelectInput';
import { useDispatch, useSelector } from 'react-redux';
import { selectBranchList } from '@store/slices/masterDataSlice';
import _ from 'lodash';
import { SelectChangeEvent } from '@mui/material';

interface BranchHeaderFilterProps {
  column: any;
  filters: any;
  setFilters?: any;
}
const BranchHeaderFilter = ({ column, filters, setFilters }: BranchHeaderFilterProps) => {
  const dispatch = useDispatch();
  const branchList = useSelector(selectBranchList);

  const filterChangeHandler = (event: SelectChangeEvent<string | number>) => {
    if (Object.keys(filters).length !== 0) {
      const value = event.target.value;
      const filtersData = _.cloneDeep(filters);
      filtersData[column.key] = value;
      dispatch(setFilters(filtersData));
    }
  };

  return (
    <div>
      <SelectInput
        label={column.label}
        options={branchList}
        name={column.key}
        value={filters[column.key]}
        onChange={filterChangeHandler}
      />
    </div>
  );
};

export default BranchHeaderFilter;
