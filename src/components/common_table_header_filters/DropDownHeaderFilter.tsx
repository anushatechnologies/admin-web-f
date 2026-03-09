import React from 'react';
import SelectInput from '@components/common/SelectInput';

interface DropDownHeaderFilterProps {
  column: any;
  filterChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  filters: any;
}
const DropDownHeaderFilter = ({ column, filterChange, filters }: DropDownHeaderFilterProps) => {
  return (
    <div>
      <SelectInput
        label={column.label}
        name={column.key}
        onChange={filterChange}
        value={filters[column.key]}
      />
    </div>
  );
};

export default DropDownHeaderFilter;
