import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Stack,
  Pagination,
  Skeleton,
} from '@mui/material';

export interface ColumnConfig {
  id: number;
  label: string;
  key?: string;
  cssClass?: string;
  template?: React.ComponentType<{ row: any; column: ColumnConfig }>;
  headerTemplate?: React.ComponentType<{
    column: ColumnConfig;
  }>;
  style?: string;
  header?: string;
}

interface DataTableProps {
  columns: ColumnConfig[];
  data: any[];
  rowsPerPageOptions?: number[];
  fixedHeaders?: boolean;
  offsetHeight?: number;
  checkBoxSelection?: boolean;
  setSelectedRows?: any;
  checkboxStoredKey?: any;
  selectedRows?: any[];
  page?: number;
  totalPages?: number;
  handleChangePage?: (event: unknown, newPage: number) => void;
  loading?: boolean;
  filters: any;
  setFilters: any;
  stickyRightCount?: number;
}

const parseStyleString = (styleString?: string): React.CSSProperties => {
  if (!styleString) return {};

  const styles: React.CSSProperties = {};
  const declarations = styleString.split(';').filter((s) => s.trim());

  declarations.forEach((declaration) => {
    const [property, value] = declaration.split(':').map((s) => s.trim());
    if (property && value) {
      const camelCaseProperty = property.replace(/-([a-z])/g, (g) => g[1].toUpperCase()); //this is allowed onely letters
      (styles as any)[camelCaseProperty] = value;
    }
  });

  return styles;
};

const DataTable: React.FC<DataTableProps> = ({
  columns = [],
  data = [],
  fixedHeaders = false,
  offsetHeight = 134,
  checkBoxSelection = false,
  setSelectedRows,
  checkboxStoredKey,
  selectedRows,
  totalPages,
  page,
  handleChangePage,
  loading = false,
  filters = {},
  setFilters,
}) => {
  const selectAllHandler = (e: any) => {
    if (e.target.checked) {
      const checkedIds = data.map((item: any) => item[checkboxStoredKey]);
      setSelectedRows(checkedIds);
    } else {
      setSelectedRows([]);
    }
  };

  const selectHandler = (row: any) => {
    setSelectedRows((prev: any[]) =>
      prev.includes(row[checkboxStoredKey])
        ? prev.filter((v) => v !== row[checkboxStoredKey])
        : [...prev, row[checkboxStoredKey]],
    );
  };

  return (
    <Paper elevation={4}>
      <TableContainer
        sx={{
          height: `calc(100vh - ${offsetHeight}px)`,
          borderRadius: '8px',
        }}
      >
        <Table stickyHeader={fixedHeaders} aria-label="data table" sx={{ borderRadius: '8px' }}>
          <TableHead>
            <TableRow>
              {checkBoxSelection && (
                <TableCell className="w-3" sx={{ backgroundColor: '#e6e6ff', padding: '4px' }}>
                  <Checkbox
                    sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
                    onChange={selectAllHandler}
                  />
                </TableCell>
              )}
              {columns.map((column) => {
                const HeaderComponent = column.headerTemplate;
                const headerStyles = parseStyleString(column.style);

                return (
                  <TableCell
                    key={column.id}
                    className={column.cssClass}
                    style={headerStyles}
                    sx={{
                      backgroundColor: '#e6e6ff',
                      fontWeight: 600,
                      padding: '6px',
                    }}
                  >
                    {HeaderComponent ? (
                      <HeaderComponent column={column} filters={filters} setFilters={setFilters} />
                    ) : (
                      column.header || column.label
                    )}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>

          {/* ✅ Loading skeleton rows */}
          {loading ? (
            <TableBody>
              {Array.from({ length: 8 }).map((_, index) => (
                <TableRow key={index}>
                  {checkBoxSelection && (
                    <TableCell sx={{ padding: '4px' }}>
                      <Skeleton variant="rectangular" width={24} height={24} />
                    </TableCell>
                  )}
                  {columns.map((col) => (
                    <TableCell key={col.id} sx={{ padding: '10px' }}>
                      <Skeleton variant="text" width="80%" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          ) : data.length === 0 ? (
            <TableBody>
              <TableRow>
                <TableCell colSpan={columns.length} align="center" sx={{ py: 4 }}>
                  No records found
                </TableCell>
              </TableRow>
            </TableBody>
          ) : (
            <TableBody>
              {data.map((row, rowIndex) => (
                <TableRow hover key={rowIndex}>
                  {checkBoxSelection && (
                    <TableCell className="w-3" sx={{ padding: '4px' }}>
                      <Checkbox
                        onChange={() => selectHandler(row)}
                        sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
                        checked={selectedRows?.includes(row[checkboxStoredKey])}
                      />
                    </TableCell>
                  )}
                  {columns.map((column) => {
                    const CellComponent = column.template;
                    const cellStyles = parseStyleString(column.style);

                    return (
                      <TableCell
                        key={column.id}
                        className={column.cssClass}
                        style={cellStyles}
                        sx={{
                          padding: '10px',
                          fontWeight: row.highlight ? 'bold' : 'normal',
                          backgroundColor: row.highlight ? '#e6e6e6' : 'transparent',
                        }}
                      >
                        {CellComponent ? (
                          <CellComponent row={row} column={column} />
                        ) : column.key ? (
                          row[column.key] || '--'
                        ) : (
                          '--'
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          )}
        </Table>
      </TableContainer>
      {totalPages && totalPages > 1 && (
        <div className="flex justify-center py-2">
          <Stack spacing={2}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handleChangePage}
              showFirstButton
              showLastButton
              color="primary"
            />
          </Stack>
        </div>
      )}
    </Paper>
  );
};

export default DataTable;
