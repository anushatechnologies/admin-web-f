import React from 'react';
import { Box } from '@mui/material';
import ValueCopyWithClick from '@components/common/ValueCopy';
import { useNavigate } from 'react-router-dom';

interface ColumnProps {
  row: any;
  column?: any;
}

const CustomerIdColumn: React.FC<ColumnProps> = ({ row, column }) => {
  const navigate = useNavigate();
  if (!row[column.key]) return <>--</>;
  const onClick = () => {
    navigate(`/${column.parentRoute}/${row.app_id}/${row.organization_id}`);
  };
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <ValueCopyWithClick value={row[column.key]} onClick={onClick} showCopyIcon={true} />
    </Box>
  );
};

export default CustomerIdColumn;
