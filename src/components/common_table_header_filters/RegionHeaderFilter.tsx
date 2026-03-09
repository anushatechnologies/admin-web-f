import React from 'react';
import SelectInput from '@components/common/SelectInput';
import { useDispatch, useSelector } from 'react-redux';
import { selectRegionList, setClusterList } from '@store/slices/masterDataSlice';
import _ from 'lodash';
import { CLUSTER_AND_BRANCH_KEYS } from '@utils/constants';
interface RegionHeaderFilterProps {
  column: any;
  filters?: any;
  setFilters?: any;
}
const RegionHeaderFilter = ({ column, filters, setFilters }: RegionHeaderFilterProps) => {
  const dispatch = useDispatch();
  const regionList = useSelector(selectRegionList);
  const filterChangeHandler = (event: any) => {
    if (Object.keys(filters).length !== 0) {
      const value = event.target.value;
      const filtersData = _.cloneDeep(filters);
      CLUSTER_AND_BRANCH_KEYS.forEach((key: string) => {
        filtersData[key] = '';
      });
      filtersData[column.key] = value;
      dispatch(setFilters(filtersData));
      dispatch(setClusterList(value));
    }
  };
  return (
    <SelectInput
      label={column.label}
      options={regionList}
      name={column.key}
      value={filters[column.key]}
      onChange={filterChangeHandler}
    />
  );
};

export default RegionHeaderFilter;
