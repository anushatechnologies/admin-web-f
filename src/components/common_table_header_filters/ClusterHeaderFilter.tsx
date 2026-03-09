import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SelectInput from '@components/common/SelectInput';
import { selectClusterList, setBranchList } from '@store/slices/masterDataSlice';
import _ from 'lodash';
import { BRANCH_KEYS } from '@utils/constants';
import { SelectChangeEvent } from '@mui/material';

interface ClusterHeaderFilterProps {
  column: any;
  filters?: any;
  setFilters?: any;
}
const ClusterHeaderFilter = ({ column, filters, setFilters }: ClusterHeaderFilterProps) => {
  const dispatch = useDispatch();
  const clusterList = useSelector(selectClusterList);
  const filterChangeHandler = (event: SelectChangeEvent<string | number>) => {
    if (Object.keys(filters).length !== 0) {
      const value = event.target.value;
      const filtersData = _.cloneDeep(filters);
      BRANCH_KEYS.forEach((key) => {
        filtersData[key] = '';
      });
      filtersData[column.key] = value;
      dispatch(setFilters(filtersData));
      dispatch(setBranchList(value));
    }
  };
  return (
    <SelectInput
      label={column.label}
      options={clusterList}
      value={filters[column.key]}
      name={column.key}
      onChange={filterChangeHandler}
    />
  );
};

export default ClusterHeaderFilter;
