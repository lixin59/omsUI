import React, { useCallback, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import styles from './style';
import { ActionCreator } from 'redux';
import TipDialog from '../../../components/OmsDialog/TipDialog';
import { useSnackbar } from 'notistack';
import { HostInfo, TunnelInfo } from '../../../store/interface';
import FormDialog from '../../../components/OmsDialog/FormDialog';
import TunnelInfoForm from './TunnelInfoForm';
import { deleteTunnelApi, editTunnelApi, HTTPResult } from '../../../api/http/httpRequestApi';
type tDP = {
  deleteTunnel: ActionCreator<any>;
  editTunnel: ActionCreator<any>;
};

type tOP = {};

type tSP = tOP & {
  tunnelList: TunnelInfo[],
  hostList: HostInfo[],
};

type tProps = tSP & tDP;

interface Column {
  id: string;
  label: string;
  minWidth?: number;
}

const columns: Column[] = [
  {
    id: 'mode',
    label: '隧道模式',
    minWidth: 50
  },
  {
    id: 'source',
    label: '目标地址',
    minWidth: 50
  },
  {
    id: 'destination',
    label: '监听地址',
    minWidth: 50
  },
  {
    id: 'status',
    label: '状态',
    minWidth: 50
  },
  {
    id: 'error_msg',
    label: '信息',
    minWidth: 50
  },
  // {
  //   id: 'hostID',
  //   label: '主机ID',
  //   minWidth: 50
  // },
  {
    id: 'density',
    label: '操作',
    minWidth: 100
  }
];

export default function JobTable({ deleteTunnel, tunnelList, hostList, editTunnel }: tProps) {
  const classes = makeStyles(styles)();
  const { enqueueSnackbar } = useSnackbar();
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [open, setOpen] = useState<boolean>(false);
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [Info, setInfo] = useState<TunnelInfo>({
    id: 0,
    mode: 'local',
    source: '',
    destination: '',
    error_msg: '',
    status: false,
    host_id: 0
  });

  const content = TunnelInfoForm({ Info, setInfo, hostList });

  const toEdit = useCallback(async() => {
    const res = (await editTunnelApi(Info)) as HTTPResult;
    if (res.code !== '200') {
      enqueueSnackbar(`修改失败${res.msg}`, {
        autoHideDuration: 3000,
        variant: 'error'
      });
      return;
    }
    // console.log('res', res);
    editTunnel(res.data);
    enqueueSnackbar(`修改成功${res.msg}`, {
      autoHideDuration: 3000,
      variant: 'success'
    });
  }, [Info]);

  const title: string = '确定要删除这个隧道吗？';
  const text: string = '如果不想删除可以点击取消';

  const dltButtonClick = (info: TunnelInfo) => {
    setInfo(info);
    setOpen(true);
  };

  const closeDialog = () => {
    setOpen(false);
  };
  const toDelete = useCallback(async() => {
    const res = (await deleteTunnelApi(Info.id)) as HTTPResult;
    if (res.code !== '200') {
      enqueueSnackbar(`隧道id: ${Info.id}删除失败${res.msg}`, {
        autoHideDuration: 3000,
        variant: 'error'
      });
      return;
    }
    // console.log('res', res);
    deleteTunnel(Info.id);
    enqueueSnackbar(`隧道id: ${Info.id} 已被删除`, {
      autoHideDuration: 3000,
      variant: 'success'
    });
  }, [Info]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper className={classes.rootTable}>
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label='sticky table'>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  align='center'
                  key={column.id}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {tunnelList && tunnelList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
              return (
                <TableRow hover role='checkbox' tabIndex={-1} key={row.id}>
                  <TableCell key={row.mode} align='center'>
                    {row.mode}
                  </TableCell>
                  <TableCell key={row.source} align='center'>
                    {row.source}
                  </TableCell>
                  <TableCell key={row.destination} align='center'>
                    {row.destination}
                  </TableCell>
                  <TableCell key={String(new Date().getTime())} align='center'>
                    {String(row.status)}
                  </TableCell>
                  <TableCell key={row.error_msg} align='center'>
                    {row.error_msg}
                  </TableCell>
                  <TableCell align='center'>
                    <Button
                      className={classes.editBtn}
                      onClick={() => { setInfo(row); setOpenEdit(true); }}
                    >
                      编辑
                    </Button>
                    <Button
                      className={classes.deleteButton}
                      onClick={() => dltButtonClick(row)}
                    >
                      删除
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component='div'
        count={tunnelList.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <TipDialog
        open={open}
        title={title}
        text={text}
        toClose={closeDialog}
        todo={toDelete}
      />
      <FormDialog
        open={openEdit}
        content={content}
        toClose={() => setOpenEdit(false)}
        title={'编辑Tunnel信息'}
        todo={toEdit}
      />
    </Paper>
  );
}
