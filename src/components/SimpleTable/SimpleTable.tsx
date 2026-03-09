import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableFooter,
} from '@mui/material';

export interface ColumnConfig {
  id: number;
  label: string;
  key?: string;
  cssClass?: string;
  template?: React.ComponentType<{ row: any; column: ColumnConfig }>;
  headerTemplate?: React.ComponentType<{ column: ColumnConfig }>;
  style?: string;
  header?: string;
  fixedHeaders?: boolean;
  offsetHeight?: number;
  totalFunction?: (data: any[]) => string | number;
  totalLabel?: string;
}

interface SimpleTableProps {
  columns: ColumnConfig[];
  data: any[];
  fixedHeaders?: boolean;
  offsetHeight?: number;
  showTotalRow?: boolean;
  noRecordsMessage?: string;
}

const parseStyleString = (styleString?: string): React.CSSProperties => {
  if (!styleString) return {};

  const styles: React.CSSProperties = {};
  const declarations = styleString.split(';').filter((s) => s.trim());

  declarations.forEach((declaration) => {
    const [property, value] = declaration.split(':').map((s) => s.trim());
    if (property && value) {
      const camelCaseProperty = property.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
      (styles as any)[camelCaseProperty] = value;
    }
  });

  return styles;
};

const SimpleTable: React.FC<SimpleTableProps> = ({
  columns,
  data,
  fixedHeaders = false,
  offsetHeight = 0,
  showTotalRow = false,
  noRecordsMessage = 'No records found',
}) => {
  return (
    <Paper>
      <TableContainer
        sx={{
          height: `calc(100vh - ${offsetHeight}px)`,
        }}
      >
        <Table stickyHeader={fixedHeaders} aria-label="data table">
          <TableHead>
            <TableRow>
              {columns.map((column) => {
                const HeaderComponent = column.headerTemplate;
                const headerStyles = parseStyleString(column.style);

                return (
                  <TableCell
                    key={column.id}
                    className={column.cssClass}
                    style={headerStyles}
                    sx={{
                      backgroundColor: '#f5f5f5',
                      fontWeight: 600,
                    }}
                  >
                    {HeaderComponent ? (
                      <HeaderComponent column={column} />
                    ) : (
                      column.header || column.label
                    )}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center" sx={{ py: 4 }}>
                  {noRecordsMessage}
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, rowIndex) => (
                <TableRow hover key={rowIndex}>
                  {columns.map((column) => {
                    const CellComponent = column.template;
                    const cellStyles = parseStyleString(column.style);

                    return (
                      <TableCell key={column.id} className={column.cssClass} style={cellStyles}>
                        {CellComponent ? (
                          <CellComponent row={row} column={column} />
                        ) : column.key ? (
                          row[column.key]
                        ) : (
                          ''
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            )}
          </TableBody>
          {showTotalRow && data.length > 0 && (
            <TableFooter>
              <TableRow>
                {columns.map((column, index) => {
                  const cellStyles = parseStyleString(column.style);
                  const totalValue = index === 0 && column.totalLabel ? column.totalLabel : '';

                  return (
                    <TableCell
                      key={column.id}
                      className={column.cssClass}
                      style={cellStyles}
                      sx={{
                        backgroundColor: '#f5f5f5',
                        fontWeight: 600,
                      }}
                    >
                      {index === 0 && !column.totalLabel ? 'Total' : totalValue}
                    </TableCell>
                  );
                })}
              </TableRow>
            </TableFooter>
          )}
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default SimpleTable;
