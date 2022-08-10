import React, { useEffect, useState, useCallback } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import { GRID_DEFAULT_LOCALE_TEXT } from './constant';
import { DataGridProps } from '@mui/x-data-grid/models/props/DataGridProps';
import OmsPagination from './OmsPagination';
import { NoRowsOverlay } from './NoRowsOverlay';
import TableToolbar from './TableToolbar';

type tProps = React.RefAttributes<HTMLDivElement> & {
  getDataApi: (...arg) => Promise<any>;
  columns: any;
  dataId?: number;
};

export default function OmsTableServer(props: tProps) {
  const { columns, dataId, getDataApi } = props;

  const [rows, setRows] = useState<any[]>([]);
  const [msg, setMsg] = useState<string>('暂无数据...');

  // const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState({
    no: 0,
    size: 10,
    total: 0
  });

  useEffect(() => {
    getDataApi(dataId).then((res) => {
      if (res.code !== '200') {
        setRows([]);
        setMsg(res.msg);
        return;
      }
      setRows(res.data.data);
      setPage({ ...page, no: res.data.page_num - 1, total: res.data.total });
    });
  }, [dataId]);

  const handleReLoad = useCallback(async () => {
    const res = await getDataApi(dataId, page.size, 1);
    if (res.code !== '200') {
      setRows([]);
      setMsg(res.msg);
      return;
    }
    setRows(res.data.data);
    setPage({ ...page, no: res.data.page_num - 1, total: res.data.total });
  }, [dataId]);

  const handlePageChange = async (newPage: number) => {
    const res = await getDataApi(dataId, page.size, newPage + 1);
    if (res.code !== '200') {
      setRows([]);
      setMsg(res.msg);
      return;
    }
    setRows(res.data.data);
    setPage({ ...page, no: res.data.page_num - 1, total: res.data.total });
  };
  const handlePageSizeChange = async (pageSize: number) => {
    const res = await getDataApi(dataId, pageSize, page.no + 1);
    if (res.code !== '200') {
      setRows([]);
      setMsg(res.msg);
      return;
    }
    setRows(res.data.data);
    setPage({ size: pageSize, no: res.data.page_num - 1, total: res.data.total });
  };

  return (
    <Box sx={{ height: '100%', width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pagination
        pageSize={page.size}
        rowsPerPageOptions={[10, 50, 100]}
        rowCount={page.total}
        paginationMode="server"
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        page={page.no}
        // loading={isLoading}
        components={{
          Toolbar: TableToolbar,
          Pagination: OmsPagination,
          NoRowsOverlay: NoRowsOverlay
        }}
        componentsProps={{
          noRowsOverlay: { msg },
          toolbar: { onReLoad: handleReLoad }
        }}
        localeText={GRID_DEFAULT_LOCALE_TEXT}
      />
    </Box>
  );
}
