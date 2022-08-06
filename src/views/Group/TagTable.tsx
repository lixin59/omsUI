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
import TipDialog from '../../components/OmsDialog/TipDialog';
// import { Scrollbars } from 'react-custom-scrollbars';
import styles from './style';
import { ActionCreator } from 'redux';
import { TagInfo } from '../../store/interface';
import { useSnackbar } from 'notistack';
import { deleteTagApi, editTagApi, HTTPResult } from '../../api/http/httpRequestApi';
import FormDialog from '../../components/OmsDialog/FormDialog';
import TagForm from './Form/TagForm';

type tDP = {
  deleteTag: ActionCreator<any>;
  addTag: ActionCreator<any>;
  editTag: ActionCreator<any>;
};

type tOP = any;

type tSP = tOP & {
  tagList: TagInfo[];
};

type tProps = tSP & tDP;

interface Column {
  id: string;
  label: string;
  minWidth?: number;
}

const columns: Column[] = [
  { id: 'name', label: '标签名称', minWidth: 170 },
  {
    id: 'operation',
    label: '操作',
    minWidth: 170
  }
];

export default function TagTable({ deleteTag, tagList, editTag }: tProps) {
  const classes = makeStyles(styles)();
  const { enqueueSnackbar } = useSnackbar();
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [open, setOpen] = useState<boolean>(false);
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [Info, setInfo] = useState<TagInfo>({
    id: 0,
    name: ''
  });

  const content = TagForm({ Info, setInfo });
  const title = '确定要删除这个标签吗？';
  const text = '如果不想删除可以点击取消';

  const dltButtonClick = (info: TagInfo) => {
    setInfo(info);
    setOpen(true);
  };
  const closeDialog = () => {
    setOpen(false);
  };

  const toEdit = useCallback(async () => {
    const res = (await editTagApi(Info)) as HTTPResult;
    if (res.code !== '200') {
      enqueueSnackbar(`标签: ${Info.name}修改失败${res.msg}`, {
        autoHideDuration: 3000,
        variant: 'error'
      });
      return;
    }
    editTag(res.data);
    enqueueSnackbar(`标签: ${Info.name} 修改成功${res.msg}`, {
      autoHideDuration: 3000,
      variant: 'success'
    });
    return true;
  }, [Info]);

  const toDelete = useCallback(async () => {
    const res = (await deleteTagApi(Info.id)) as HTTPResult;
    if (res.code !== '200') {
      enqueueSnackbar(`标签: ${Info.name}删除失败${res.msg}`, {
        autoHideDuration: 3000,
        variant: 'error'
      });
      return;
    }
    deleteTag(Info.id);
    enqueueSnackbar(`标签: ${Info.name} 已被删除`, {
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
        {/* <Scrollbars style={{ width: '100%', height: '100%' }}>*/}
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
            {tagList &&
              tagList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.name}>
                    <TableCell key={row.name} align="center">
                      {row.name}
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
        {/* </Scrollbars>*/}
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        labelRowsPerPage={<div>每页行数:</div>}
        labelDisplayedRows={({ from, to, count }) => `${from}-${to} 总数 ${count !== -1 ? count : 0}`}
        count={tagList.length}
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
        title={'编辑标签信息'}
        todo={toEdit}
      />
    </Paper>
  );
}
