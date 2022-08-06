import React, { useCallback, useEffect, useReducer, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import OmsTable from '../../../components/OmsTable/index';
import styles from './style';
import { ActionCreator } from 'redux';
import { useSnackbar } from 'notistack';
import { connect } from 'react-redux';
import { HostInfo, IState, JobInfo } from '../../../store/interface';
import actions from '../../../store/action';
import {
  addJobApi,
  deleteJobApi,
  editJobApi,
  getJobsApi,
  HTTPResult,
  jobLogsUrlApi,
  jobStartApi,
  jobStopApi
} from '../../../api/http/httpRequestApi';
import FormDialog from '../../../components/OmsDialog/FormDialog';
import JobInfoForm from './JobInfoForm';
import { GridRowParams } from '@mui/x-data-grid/models/params/gridRowParams';
import { GridActionsCellItem } from '@mui/x-data-grid';
import Tooltip from '@material-ui/core/Tooltip';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import EventNoteIcon from '@material-ui/icons/EventNote';
import EditIcon from '@material-ui/icons/Edit';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import TipDialog from '../../../components/OmsDialog/TipDialog';
import LogDialog from '../../../components/OmsDialog/LogDialog';
import axios, { CancelTokenSource } from 'axios';

type tDP = {
  toInit: ActionCreator<any>;
  deleteJob: ActionCreator<any>;
  addJob: ActionCreator<any>;
  editJob: ActionCreator<any>;
};

// eslint-disable-next-line @typescript-eslint/ban-types
type tOP = {};

type tSP = tOP & {
  jobList: JobInfo[];
  hostList: HostInfo[];
};

const mapStateToProps = (state: IState, props: tOP): tSP => ({
  ...props,
  jobList: state.jobList,
  hostList: state.hostList
});
const mapDispatch: tDP = {
  toInit: actions.initJobInfo,
  deleteJob: actions.deleteJobInfo,
  addJob: actions.addJobInfo,
  editJob: actions.editJobInfo
};

type tProps = tSP & tDP;

function formInit() {
  return {
    open: false,
    title: '',
    todo: true
  };
}

function formReducer(state, action: any) {
  switch (action.type) {
    case 'open':
      return { ...state, open: true };
    case 'close':
      return { ...state, open: false };
    case 'todo':
      return { ...state, todo: action.payload };
    case 'title':
      return { ...state, title: action.payload };
    case 'reset':
      return formInit();
    default:
      throw new Error();
  }
}

function tipInit() {
  return {
    open: false,
    text: '',
    title: '',
    todo: true
  };
}

function tipReducer(state, action: any) {
  switch (action.type) {
    case 'open':
      return { ...state, open: true };
    case 'close':
      return { ...state, open: false };
    case 'text':
      return { ...state, text: action.payload };
    case 'title':
      return { ...state, title: action.payload };
    case 'todo':
      return { ...state, todo: action.payload };
    case 'reset':
      return tipInit();
    default:
      throw new Error();
  }
}

const JobPage = ({ hostList, jobList, addJob, editJob, deleteJob, toInit }: tProps) => {
  useEffect(() => {
    (async () => {
      const res = (await getJobsApi()) as HTTPResult;
      if (res.code !== '200') {
        return;
      }
      toInit(res.data);
    })();
  }, []);

  const classes = makeStyles(styles)();
  const { enqueueSnackbar } = useSnackbar();
  const [form, formDispatch] = useReducer(formReducer, formInit(), formInit);
  const [tip, tipDispatch] = useReducer(tipReducer, tipInit(), tipInit);
  const [openLog, setOpenLog] = useState<boolean>(false);
  const [logData, setLogData] = useState<any>('');
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

  const formContent = JobInfoForm({ Info, hostList, setInfo });

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
          setLogData(dataChunk);
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
    const url = jobLogsUrlApi(id);
    fetchRepos(url);
    setOpenLog(true);
  };

  const toCloseLog = useCallback(() => {
    if (cancelToken) {
      // console.log(cancelToken.cancel);
      cancelToken.cancel('cancel http');
    }
    setOpenLog(false);
  }, [cancelToken]);

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

  const editForm = useCallback(async () => {
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
    return true;
  }, [Info]);
  const addNewJob = useCallback(async () => {
    // if (Info.type === '') {
    //   enqueueSnackbar(`请选择一个类型！`, {
    //     autoHideDuration: 3000,
    //     variant: 'warning'
    //   });
    //   return;
    // }
    if (Info.type === 'cron' && !Info.spec) {
      enqueueSnackbar(`选中cron类型, cron表达式不能为空！`, {
        autoHideDuration: 3000,
        variant: 'warning'
      });
      return;
    }
    if (!Info.name) {
      enqueueSnackbar(`job名称不能为空！`, {
        autoHideDuration: 3000,
        variant: 'warning'
      });
      return;
    }
    // if (jobList.some((e) => e.name === name)) {
    //   enqueueSnackbar(`该Job已存在！`, {
    //     autoHideDuration: 3000,
    //     variant: 'warning'
    //   });
    //   return;
    // }
    const res = (await addJobApi({
      name: Info.name,
      type: Info.type as 'cron' | 'task',
      spec: Info.spec,
      cmd: Info.cmd,
      host_id: Info.host_id as number
    })) as HTTPResult;
    if (res.code !== '200') {
      enqueueSnackbar(`添加任务失败${res.msg}`, {
        autoHideDuration: 3000,
        variant: 'error'
      });
      return;
    }
    addJob(res.data);
    enqueueSnackbar(`任务：${res.data.name} 添加成功${res.msg}`, {
      autoHideDuration: 3000,
      variant: 'success'
    });
    setInfo({
      id: 0,
      name: '',
      type: 'cron',
      spec: '',
      cmd: '',
      status: '',
      host_id: 0
    });
    return true;
  }, [Info]);

  const openForm = () => {
    formDispatch({ type: 'title', payload: '添加任务' });
    formDispatch({ type: 'todo', payload: true });
    formDispatch({ type: 'open' });
  };

  const getJobRows = (list: JobInfo[]) => {
    return list?.map((j) => {
      return {
        ...j,
        hostName: hostList?.find((h) => h.id === j.host_id)?.name
      };
    });
  };

  const columns = [
    {
      field: 'id',
      headerName: 'id',
      minWidth: 80
    },
    {
      field: 'type',
      headerName: 'job类型',
      minWidth: 100
    },
    {
      field: 'status',
      headerName: '状态',
      minWidth: 100
    },
    {
      field: 'hostName',
      headerName: '主机名称',
      minWidth: 140
    },
    {
      field: 'name',
      headerName: 'job名称',
      minWidth: 140
    },
    {
      field: 'spec',
      headerName: 'cron表达式',
      minWidth: 160
    },
    {
      field: 'cmd',
      headerName: '命令',
      minWidth: 160
    },
    {
      field: 'action',
      headerName: '操作',
      minWidth: 240,
      type: 'actions',
      getActions: (params: GridRowParams) => {
        const { id, name } = params.row;
        return [
          <GridActionsCellItem
            key={params.row.id + '启动'}
            icon={
              <Tooltip title="启动" placement="top-start">
                <PowerSettingsNewIcon
                  onClick={() => {
                    startJob(params.row);
                  }}
                  color="primary"
                />
              </Tooltip>
            }
            label="启动"
          />,
          <GridActionsCellItem
            key={params.row.id + '停止'}
            icon={
              <Tooltip title="停止" placement="top-start">
                <PowerSettingsNewIcon
                  onClick={() => {
                    stopJob(params.row);
                  }}
                  color="error"
                />
              </Tooltip>
            }
            label="停止"
          />,
          <GridActionsCellItem
            key={params.row.id + '查看日志'}
            icon={
              <Tooltip title="查看日志" placement="top-start">
                <EventNoteIcon
                  onClick={() => {
                    jobLogs(params.row);
                  }}
                />
              </Tooltip>
            }
            label="查看日志"
          />,
          <GridActionsCellItem
            key={params.row.id + 'Edit'}
            icon={
              <Tooltip title="编辑" placement="top-start">
                <EditIcon
                  color="secondary"
                  onClick={() => {
                    formDispatch({ type: 'todo', payload: false });
                    formDispatch({ type: 'title', payload: '编辑任务信息' });
                    setInfo(params.row);
                    formDispatch({ type: 'open' });
                  }}
                />
              </Tooltip>
            }
            label="编辑"
          />,
          <GridActionsCellItem
            key={params.row.id + 'Delete'}
            icon={
              <Tooltip title="删除" placement="top-start">
                <DeleteForeverIcon
                  color="error"
                  onClick={() => {
                    tipDispatch({ type: 'open' });
                    tipDispatch({ type: 'text', payload: `确认要任务：${name} 吗？` });
                    tipDispatch({ type: 'title', payload: '删除任务' });
                    setInfo(params.row);
                    tipDispatch({ type: 'todo', payload: toDelete });
                  }}
                />
              </Tooltip>
            }
            label="删除"
          />
        ];
      }
    }
  ];

  return (
    <div className={classes.itemPage}>
      <div className={classes.ControlBox}>
        <Button className={classes.addButton} onClick={openForm}>
          添加任务
        </Button>
      </div>
      <div className={classes.shellBox}>
        <Card style={{ width: '100%', height: '100%', margin: '0 auto', marginTop: '20px' }}>
          <OmsTable columns={columns} rows={getJobRows(jobList)}></OmsTable>
        </Card>
      </div>
      <LogDialog open={openLog} title={'任务日志'} text={logData} toClose={toCloseLog} />
      <TipDialog
        open={tip.open}
        text={tip.text}
        title={tip.title}
        toClose={() => tipDispatch({ type: 'close' })}
        todo={tip.todo}
      />
      <FormDialog
        open={form.open}
        content={formContent}
        toClose={() => formDispatch({ type: 'close' })}
        title={form.title}
        todo={form.todo ? addNewJob : editForm}
      />
    </div>
  );
};

export default connect(mapStateToProps, mapDispatch)(JobPage);
