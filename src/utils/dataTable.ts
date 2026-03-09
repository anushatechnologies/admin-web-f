import { ColumnConfig } from '@components/DataTable';

export const getRightStickyStyle = (
  index: number,
  columns: ColumnConfig[],
  stickyRightCount: number,
): React.CSSProperties => {
  if (!isStickyRight(index, columns.length, stickyRightCount)) return {};

  let offset = 0;

  for (let i = columns.length - 1; i > index; i--) {
    offset += columns[i].width || 0;
  }

  return {
    position: 'sticky',
    right: offset,
    zIndex: 3,
    background: '#fff',
  };
};

export const isStickyRight = (index: number, total: number, count: number) => {
  return count > 0 && index >= total - count;
};
