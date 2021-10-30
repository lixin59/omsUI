import React, { useState } from 'react';
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

type tDP = {
  deleteGroup: ActionCreator<any>;
  addGroup: ActionCreator<any>;
  editGroup: ActionCreator<any>;
};

type tOP = {};

type tSP = tOP & {
  groupList: GroupInfo[]
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
    id: 'pattern',
    label: '模式',
    minWidth: 170,
  },
  {
    id: 'size',
    label: '规则',
    minWidth: 170,
  },
  {
    id: 'density',
    label: '操作',
    minWidth: 170,
  },
];

export default function GroupTable({ groupList, deleteGroup }: tProps) {
  const classes = makeStyles(styles)();
  const { enqueueSnackbar } = useSnackbar();
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [open, setOpen] = useState<boolean>(false);
  const [name, setName] = useState<string>('');

  const title: string = '确定要删除这个分组吗？';
  const text: string = '如果不想删除可以点击取消';
  const dltButtonClick = (name: string) => {
    setName(name);
    setOpen(true);
  };
  const closeDialog = () => {
    setOpen(false);
  };
  const toDelete = () => {
    deleteGroup(name);
    enqueueSnackbar(`分组: ${name} 已被删除`, {
      autoHideDuration: 3000,
      variant: 'success',
    });
  };

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
            {groupList && groupList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
              return (
                <TableRow hover role='checkbox' tabIndex={-1} key={row.name}>
                  <TableCell key={row.name} align='center'>
                    {row.name}
                  </TableCell>
                  <TableCell key={row.pattern} align='center'>
                    {row.pattern}
                  </TableCell>
                  <TableCell key={row.rule} align='center'>
                    {row.rule}
                  </TableCell>
                  <TableCell align='center'>
                    <Button
                      className={classes.deleteButton}
                      onClick={() => dltButtonClick(row.name)}
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
        count={groupList.length}
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
    </Paper>
  );
}
