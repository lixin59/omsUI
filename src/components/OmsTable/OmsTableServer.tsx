import React, { useEffect, useState, useCallback, Dispatch, SetStateAction } from 'react';
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
  rows?: any;
  updateRows?: Dispatch<SetStateAction<any>>;
  dataId?: number;
};

export default function OmsTableServer(props: tProps) {
  const { columns, dataId, getDataApi, updateRows, rows } = props;

  const [orows, setRows] = useState<any[]>([]);
  const [msg, setMsg] = useState<string>('暂无数据...');

  // const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState({
    no: 0,
    size: 10,
    total: 0
  });

  useEffect(() => {
    getDataApi(10, 1, dataId).then((res) => {
      if (res.code !== '200') {
        if (updateRows) {
          updateRows([]);
        } else {
          setRows([]);
        }
        setMsg(res.msg);
        return;
      }
      if (updateRows) {
        updateRows(res.data.data);
      } else {
        setRows(res.data.data);
      }
      setPage({ ...page, no: res.data.page_num - 1, total: res.data.total });
    });
  }, [dataId]);

  const handleReLoad = useCallback(async () => {
    const res = await getDataApi(page.size, 1, dataId);
    if (res.code !== '200') {
      if (updateRows) {
        updateRows([]);
      } else {
        setRows([]);
      }
      setMsg(res.msg);
      return;
    }
    if (updateRows) {
      updateRows(res.data.data);
    } else {
      setRows(res.data.data);
    }
    setPage({ ...page, no: res.data.page_num - 1, total: res.data.total });
  }, [dataId]);

  const handlePageChange = async (newPage: number) => {
    const res = await getDataApi(page.size, newPage + 1, dataId);
    if (res.code !== '200') {
      if (updateRows) {
        updateRows([]);
      } else {
        setRows([]);
      }
      setMsg(res.msg);
      return;
    }
    if (updateRows) {
      updateRows(res.data.data);
    } else {
      setRows(res.data.data);
    }
    setPage({ ...page, no: res.data.page_num - 1, total: res.data.total });
  };
  const handlePageSizeChange = async (pageSize: number) => {
    const res = await getDataApi(pageSize, page.no + 1, dataId);
    if (res.code !== '200') {
      if (updateRows) {
        updateRows([]);
      } else {
        setRows([]);
      }
      setMsg(res.msg);
      return;
    }
    if (updateRows) {
      updateRows(res.data.data);
    } else {
      setRows(res.data.data);
    }
    setPage({ size: pageSize, no: res.data.page_num - 1, total: res.data.total });
  };

  return (
    <Box sx={{ height: '100%', width: '100%' }}>
      <DataGrid
        rows={rows || orows}
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
