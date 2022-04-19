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
import LogDialog from '../../../components/OmsDialog/LogDialog';
import TipDialog from '../../../components/OmsDialog/TipDialog';
import { useSnackbar } from 'notistack';
import { JobInfo } from '../../../store/interface';
import FormDialog from '../../../components/OmsDialog/FormDialog';
import JobInfoForm from './JobInfoForm';
import {
  deleteJobApi,
  editJobApi,
  jobStartApi,
  jobStopApi,
  // jobLogsApi,
  HTTPResult,
  jobLogsUrlApi
} from '../../../api/http/httpRequestApi';
import axios, { CancelTokenSource } from 'axios';

type tDP = {
  deleteJob: ActionCreator<any>;
  editJob: ActionCreator<any>;
};

type tOP = any;

type tSP = tOP & {
  jobList: JobInfo[];
};

type tProps = tSP & tDP;

interface Column {
  id: string;
  label: string;
  minWidth?: number;
}

const columns: Column[] = [
  {
    id: 'name',
    label: 'job名称',
    minWidth: 100
  },
  {
    id: 'type',
    label: 'job类型',
    minWidth: 100
  },
  {
    id: 'spec',
    label: 'cron表达式',
    minWidth: 100
  },
  {
    id: 'cmd',
    label: '命令',
    minWidth: 100
  },
  {
    id: 'status',
    label: '状态',
    minWidth: 100
  },
  // {
  //   id: 'id',
  //   label: '主机id',
  //   minWidth: 50
  // },
  {
    id: 'density',
    label: '操作',
    minWidth: 100
  }
];

export default function JobTable({ deleteJob, jobList, editJob }: tProps) {
  const classes = makeStyles(styles)();
  const { enqueueSnackbar } = useSnackbar();
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [open, setOpen] = useState<boolean>(false);
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [cancelToken, setCancelToken] = useState<CancelTokenSource | null>(null);
  const [Info, setInfo] = useState<JobInfo>({
    id: 0,
    name: '',
    type: 'cron',
    spec: '',
    cmd: '',
    status: '',
    host_id: 0
  });

  const [openLog, setOpenLog] = useState<boolean>(false);
  const [data, setData] = useState<any>('');

  const title = '确定要删除这个任务吗？';
  const text = '如果不想删除可以点击取消';

  const content = JobInfoForm({ Info, setInfo });

  const startJob = async (info: JobInfo) => {
    const { id, name } = info;
    const res = (await jobStartApi(id)) as HTTPResult;
    editJob(res.data);
    if (res.code !== '200') {
      enqueueSnackbar(`任务: ${name} 启动失败${res.msg}`, {
        autoHideDuration: 3000,
        variant: 'error'
      });
      return;
    }
    enqueueSnackbar(`任务: ${name} 启动成功${res.msg}`, {
      autoHideDuration: 3000,
      variant: 'success'
    });
  };

  const stopJob = async (info: JobInfo) => {
    const { id, name } = info;
    const res = (await jobStopApi(id)) as HTTPResult;
    if (res.code !== '200') {
      enqueueSnackbar(`任务: ${name} 停止失败${res.msg}`, {
        autoHideDuration: 3000,
        variant: 'error'
      });
      return;
    }
    editJob(res.data);
    enqueueSnackbar(`任务: ${name} 停止成功${res.msg}`, {
      autoHideDuration: 3000,
      variant: 'success'
    });
  };

  const fetchRepos = (url: string) => {
    if (cancelToken) {
      // console.log('取消上一次请求');
      cancelToken.cancel('Operation canceled due to new request.');
    }
    const source = axios.CancelToken.source(); // 声明一个source对象
    setCancelToken(source);

    axios
      .get(url, {
        onDownloadProgress: (progressEvent) => {
          const dataChunk = progressEvent.currentTarget.response;
          setData(dataChunk);
          // console.log(dataChunk);
        },
        cancelToken: source.token
      })
      .catch((error) => {
        if (axios.isCancel(error)) {
          console.log('Request canceled', error);
        } else {
          console.log(error);
        }
      });
    // source.cancel('Operation canceled by the user.');
  };

  const jobLogs = async (info: JobInfo) => {
    const { id } = info;
    // const resd = (await jobLogsApi(id)) as HTTPResult;
    // jobLogsApi(id);
    const url = jobLogsUrlApi(id);
    // window.open(res);
    fetchRepos(url);
    setOpenLog(true);
    // const a = document.createElement('a');
    // a.setAttribute('href', res);
    // a.setAttribute('target', '_blank');
    // a.setAttribute('id', 'js_a');
    // if (document.getElementById('js_a')) {
    //   document.body.removeChild(document.getElementById('js_a'));
    // }
    // document.body.appendChild(a);
    // a.click();
  };

  const toEdit = useCallback(async () => {
    const res = (await editJobApi(Info)) as HTTPResult;
    if (res.code !== '200') {
      enqueueSnackbar(`任务: ${Info.name}修改失败${res.msg}`, {
        autoHideDuration: 3000,
        variant: 'error'
      });
      return;
    }
    // console.log('res', res);
    editJob(res.data);
    enqueueSnackbar(`任务: ${Info.name} 修改成功${res.msg}`, {
      autoHideDuration: 3000,
      variant: 'success'
    });
  }, [Info]);

  const dltButtonClick = (info: JobInfo) => {
    setInfo(info);
    setOpen(true);
  };
  const closeDialog = () => {
    setOpen(false);
  };

  const toDelete = useCallback(async () => {
    const res = (await deleteJobApi(Info.id)) as HTTPResult;
    if (res.code !== '200') {
      enqueueSnackbar(`任务: ${Info.name}删除失败${res.msg}`, {
        autoHideDuration: 3000,
        variant: 'error'
      });
      return;
    }
    // console.log('res', res);
    deleteJob(Info.id);
    enqueueSnackbar(`任务: ${Info.name} 已被删除`, {
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

  const toCloseLog = useCallback(() => {
    if (cancelToken) {
      // console.log(cancelToken.cancel);
      cancelToken.cancel('cancel http');
    }
    setOpenLog(false);
  }, [cancelToken]);

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
            {jobList &&
              jobList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.name}>
                    <TableCell align="center">{row.name}</TableCell>
                    <TableCell align="center">{row.type}</TableCell>
                    <TableCell align="center">{row.spec}</TableCell>
                    <TableCell align="center">{row.cmd}</TableCell>
                    <TableCell align="center">{row.status}</TableCell>
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
                      <Button className={classes.starBtn} onClick={() => startJob(row)}>
                        启动
                      </Button>
                      <Button className={classes.stopBtn} onClick={() => stopJob(row)}>
                        停止
                      </Button>
                      <Button className={classes.reStarBtn} onClick={() => jobLogs(row)}>
                        日志
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
        component="div"
        labelRowsPerPage={<div>每页行数:</div>}
        labelDisplayedRows={({ from, to, count }) => `${from}-${to} 总数 ${count !== -1 ? count : 0}`}
        count={jobList.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <LogDialog open={openLog} title={'任务日志'} text={data} toClose={toCloseLog} />
      <TipDialog open={open} title={title} text={text} toClose={closeDialog} todo={toDelete} />
      <FormDialog
        open={openEdit}
        content={content}
        toClose={() => setOpenEdit(false)}
        title={'编辑Job信息'}
        todo={toEdit}
      />
    </Paper>
  );
}
