import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar, GridLocaleText } from '@mui/x-data-grid';
import { DataGridProps } from '@mui/x-data-grid/models/props/DataGridProps';
import { GRID_DEFAULT_LOCALE_TEXT } from './constant';

type tProps = DataGridProps & React.RefAttributes<HTMLDivElement>;

export default function OmsTable(props: tProps) {
  const { columns, rows } = props;
  return (
    <Box sx={{ height: '100%', width: '100%' }}>
      {rows.length < 1 ? (
        <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <h1>暂无数据...</h1>
        </div>
      ) : (
        <DataGrid
          rows={rows}
          columns={columns}
          components={{
            Toolbar: GridToolbar
          }}
          checkboxSelection
          localeText={GRID_DEFAULT_LOCALE_TEXT}
        />
      )}
    </Box>
  );
}
