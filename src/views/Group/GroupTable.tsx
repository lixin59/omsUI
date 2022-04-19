import React, { useState, useCallback } from 'react';
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
import { GroupInfo } from '../../store/interface';
import TipDialog from '../../components/OmsDialog/TipDialog';
import { useSnackbar } from 'notistack';
import FormDialog from '../../components/OmsDialog/FormDialog';
import GroupForm from './Form/GroupFrom';
import { editGroupApi, deleteGroupApi, HTTPResult } from '../../api/http/httpRequestApi';

type tDP = {
  deleteGroup: ActionCreator<any>;
  addGroup: ActionCreator<any>;
  editGroup: ActionCreator<any>;
};

type tOP = any;

type tSP = tOP & {
  groupList: GroupInfo[];
};

type tProps = tSP & tDP;

interface Column {
  id: string;
  label: string;
  minWidth?: number;
}

const columns: Column[] = [
  { id: 'name', label: '分组名称', minWidth: 170 },
  {
    id: 'mode',
    label: '模式',
    minWidth: 170
  },
  {
    id: 'params',
    label: '规则',
    minWidth: 170
  },
  {
    id: 'density',
    label: '操作',
    minWidth: 170
  }
];

export default function GroupTable({ groupList, deleteGroup, editGroup }: tProps) {
  const classes = makeStyles(styles)();
  const { enqueueSnackbar } = useSnackbar();
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [open, setOpen] = useState<boolean>(false);
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [Info, setInfo] = useState<GroupInfo>({
    id: 0,
    name: '',
    mode: 0,
    params: ''
  });

  const content = GroupForm({ Info, setInfo });

  const toEdit = useCallback(async () => {
    const res = (await editGroupApi(Info)) as HTTPResult;
    if (res.code !== '200') {
      enqueueSnackbar(`分组: ${Info.name}修改失败${res.msg}`, {
        autoHideDuration: 3000,
        variant: 'error'
      });
      return;
    }
    editGroup(res.data);
    enqueueSnackbar(`分组: ${Info.name} 修改成功${res.msg}`, {
      autoHideDuration: 3000,
      variant: 'success'
    });
  }, [Info]);

  const title = '确定要删除这个分组吗？';
  const text = '如果不想删除可以点击取消';
  const dltButtonClick = (info: GroupInfo) => {
    setInfo(info);
    setOpen(true);
  };
  const closeDialog = () => {
    setOpen(false);
  };
  const toDelete = useCallback(async () => {
    const res = (await deleteGroupApi(Info.id)) as HTTPResult;
    if (res.code !== '200') {
      enqueueSnackbar(`分组: ${Info.name}删除失败${res.msg}`, {
        autoHideDuration: 3000,
        variant: 'error'
      });
      return;
    }
    deleteGroup(Info.id);
    enqueueSnackbar(`分组: ${Info.name} 已被删除`, {
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
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell align="center" key={column.id} style={{ minWidth: column.minWidth }}>
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {groupList &&
              groupList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.name}>
                    <TableCell key={row.name} align="center">
                      {row.name}
                    </TableCell>
                    <TableCell key={row.mode} align="center">
                      {row.mode ? '规则模式' : '主机模式'}
                    </TableCell>
                    <TableCell key={row.params} align="center">
                      {row.params}
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        className={classes.editBtn}
                        onClick={() => {
                          setInfo(row);
                          setOpenEdit(true);
                        }}>
                        编辑
                      </Button>
                      <Button className={classes.deleteButton} onClick={() => dltButtonClick(row)}>
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
        labelRowsPerPage={<div>每页行数:</div>}
        labelDisplayedRows={({ from, to, count }) => `${from}-${to} 总数 ${count !== -1 ? count : 0}`}
        component="div"
        count={groupList.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <TipDialog open={open} title={title} text={text} toClose={closeDialog} todo={toDelete} />
      <FormDialog
        open={openEdit}
        content={content}
        toClose={() => setOpenEdit(false)}
        title={'编辑分组信息'}
        todo={toEdit}
      />
    </Paper>
  );
}
