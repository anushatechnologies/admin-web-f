import React from 'react';
import FormattedNumberInput from '@components/common/FormattedNumberInput';

interface MoneyInputHeaderColumnProps {
  column: any;
  filterChange: (value: string) => void;
}
const MoneyInputHeaderColumn: React.FC<MoneyInputHeaderColumnProps> = ({
  column,
  filterChange,
}) => {
  return (
    <div>
      <FormattedNumberInput onChange={filterChange} label={column.label} name={column.key} />
    </div>
  );
};

export default MoneyInputHeaderColumn;
