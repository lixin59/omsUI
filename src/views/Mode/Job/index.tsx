import React, { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import OmsTable from '../../../components/OmsTable/index';
import styles from './style';
import { ActionCreator } from 'redux';
import { useSnackbar } from 'notistack';
import { connect } from 'react-redux';
import { GroupInfo, HostInfo, IState, JobInfo, PlayerInfo, TagInfo } from '../../../store/interface';
import actions from '../../../store/action';
import {
  addJobApi,
  deleteJobApi,
  editJobApi,
  HTTPResult,
  jobLogApi,
  jobLogListApi,
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
import OmsTableServer from '../../../components/OmsTable/OmsTableServer';

type tDP = {
  updateJobList: ActionCreator<any>;
  updateGroupList: ActionCreator<any>;
  updateTagList: ActionCreator<any>;
  updatePlayerInfo: ActionCreator<any>;
  updateHostList: ActionCreator<any>;
};

// eslint-disable-next-line @typescript-eslint/ban-types
type tOP = {};

type tSP = tOP & {
  jobList: JobInfo[];
  hostList: HostInfo[];
  tagList: TagInfo[];
  groupList: GroupInfo[];
  playerList: PlayerInfo[];
};

const mapStateToProps = (state: IState, props: tOP): tSP => ({
  ...props,
  jobList: state.jobList,
  hostList: state.hostList,
  tagList: state.tagList,
  groupList: state.groupList,
  playerList: state.playerList
});
const mapDispatch: tDP = {
  updateJobList: actions.updateJobList,
  updateGroupList: actions.updateGroupList,
  updateTagList: actions.updateTagList,
  updatePlayerInfo: actions.initPlayerInfo,
  updateHostList: actions.getHostList
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

const JobPage = (props: tProps) => {
  const {
    hostList,
    jobList,
    tagList,
    groupList,
    playerList,
    updateJobList,
    updateGroupList,
    updateTagList,
    updateHostList,
    updatePlayerInfo
  } = props;

  useEffect(() => {
    updateJobList();
    updateGroupList();
    updateTagList();
    updateHostList();
    updatePlayerInfo();
  }, []);

  const classes = makeStyles(styles)();
  const { enqueueSnackbar } = useSnackbar();
  const [form, formDispatch] = useReducer(formReducer, formInit(), formInit);
  const [tip, tipDispatch] = useReducer(tipReducer, tipInit(), tipInit);
  const [openLog, setOpenLog] = useState<boolean>(false);
  const [logData, setLogData] = useState<any>('');
  const [isShowLogList, setIsShowLogList] = useState<number>(0);
  const [Info, setInfo] = useState<JobInfo>({
    id: 0,
    name: '',
    type: 'task',
    spec: '',
    cmd: '',
    status: '',
    cmd_type: 'cmd',
    cmd_id: 0,
    execute_type: 'host',
    execute_id: 0
  });

  useEffect(() => {
    try {
      const div = divRef.current as HTMLDivElement;
      if (div) {
        div.scrollTop = div.scrollHeight;
      }
    } catch (e) {
      console.log(e);
    }
  }, [isShowLogList]);

  const divRef = useRef<null | HTMLDivElement>(null);

  const execute = { host: hostList, group: groupList, tag: tagList };

  const formContent = JobInfoForm({
    Info,
    setInfo,
    execute,
    playerList
  });

  const startJob = async (info: JobInfo) => {
    const { id, name } = info;
    const res = (await jobStartApi(id)) as HTTPResult;
    updateJobList();
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
    updateJobList();
    enqueueSnackbar(`任务: ${name} 停止成功${res.msg}`, {
      autoHideDuration: 3000,
      variant: 'success'
    });
  };

  const jobLogs = (info: JobInfo) => {
    const { id } = info;
    // const res = await jobLogListApi(id);
    // if (res.code !== '200') {
    //   enqueueSnackbar(`任务: ${id} 日志列表获取失败${res.msg}`, {
    //     autoHideDuration: 3000,
    //     variant: 'error'
    //   });
    //   return;
    // }
    setIsShowLogList(id);
  };

  const getJobLog = async (id: number) => {
    const res = await jobLogApi(id);
    if (res.code !== '200') {
      enqueueSnackbar(`id: ${id} 日志信息获取失败${res.msg}`, {
        autoHideDuration: 3000,
        variant: 'error'
      });
      return;
    }
    setLogData(res.data);
    setOpenLog(true);
  };

  const toCloseLog = useCallback(() => {
    setOpenLog(false);
  }, [logData]);

  const toDelete = useCallback(
    async (Info) => {
      const res = (await deleteJobApi(Info.id)) as HTTPResult;
      if (res.code !== '200') {
        enqueueSnackbar(`任务: ${Info.name}删除失败${res.msg}`, {
          autoHideDuration: 3000,
          variant: 'error'
        });
        return;
      }
      updateJobList();
      enqueueSnackbar(`任务: ${Info.name} 已被删除`, {
        autoHideDuration: 3000,
        variant: 'success'
      });
    },
    [Info]
  );

  const editForm = useCallback(async () => {
    const res = (await editJobApi(Info)) as HTTPResult;
    if (res.code !== '200') {
      enqueueSnackbar(`任务: ${Info.name}修改失败${res.msg}`, {
        autoHideDuration: 3000,
        variant: 'error'
      });
      return;
    }
    updateJobList();
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
    const res = (await addJobApi({
      name: Info.name,
      type: Info.type as 'cron' | 'task',
      spec: Info.spec,
      cmd: Info.cmd,
      cmd_type: Info.cmd_type,
      cmd_id: Info.cmd_id,
      execute_type: Info.execute_type,
      execute_id: Info.execute_id as number
    })) as HTTPResult;
    if (res.code !== '200') {
      enqueueSnackbar(`添加任务失败${res.msg}`, {
        autoHideDuration: 3000,
        variant: 'error'
      });
      return;
    }
    updateJobList();
    enqueueSnackbar(`任务：${res.data.name} 添加成功${res.msg}`, {
      autoHideDuration: 3000,
      variant: 'success'
    });
    setInfo({
      id: 0,
      name: '',
      type: 'task',
      spec: '',
      cmd: '',
      status: '',
      cmd_type: 'cmd',
      cmd_id: 0,
      execute_type: 'host',
      execute_id: 0
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
        executeName: execute[j.execute_type]?.find((h) => h.id === j.execute_id)?.name,
        cmd: j.cmd_type === 'cmd' ? j.cmd : playerList.find((p) => p.id === j.cmd_id)?.name
      };
    });
  };

  const columns = [
    {
      field: 'id',
      headerName: 'id',
      maxWidth: 40
    },
    {
      field: 'type',
      headerName: '任务类型',
      maxWidth: 140
    },
    {
      field: 'name',
      headerName: '任务名称',
      minWidth: 140
    },
    {
      field: 'execute_type',
      headerName: '执行对象类型',
      maxWidth: 140
    },
    {
      field: 'executeName',
      headerName: '执行对象',
      maxWidth: 140
    },
    {
      field: 'cmd_type',
      headerName: '命令类型',
      maxWidth: 140
    },
    {
      field: 'cmd',
      headerName: '命令/剧本名',
      maxWidth: 140
    },
    {
      field: 'status',
      headerName: '状态',
      maxWidth: 140
    },
    {
      field: 'spec',
      headerName: 'cron表达式',
      maxWidth: 140
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
            key={params.row.id + '查看日志列表'}
            icon={
              <Tooltip title="查看日志列表" placement="top-start">
                <EventNoteIcon
                  onClick={() => {
                    jobLogs(params.row);
                  }}
                />
              </Tooltip>
            }
            label="查看日志列表"
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
                    tipDispatch({ type: 'text', payload: `确认要删除任务：${name} 吗？` });
                    tipDispatch({ type: 'title', payload: '删除任务' });
                    // setInfo(params.row);
                    tipDispatch({
                      type: 'todo',
                      payload: () => {
                        toDelete(params.row);
                      }
                    });
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
  const columnsLog = [
    {
      field: 'id',
      headerName: 'id',
      minWidth: 40
    },
    {
      field: 'job_id',
      headerName: '任务id',
      maxWidth: 140
    },
    {
      field: 'start_time',
      headerName: '开始时间',
      minWidth: 240,
      valueGetter: (params) => {
        return new Date(params.row.start_time).toLocaleString('chinese', { hour12: false });
      }
    },
    {
      field: 'end_time',
      headerName: '结束时间',
      minWidth: 240,
      valueGetter: (params) => {
        return new Date(params.row.end_time).toLocaleString('chinese', { hour12: false });
      }
    },
    {
      field: 'status',
      headerName: '执行状态',
      maxWidth: 140
    },
    {
      field: 'action',
      headerName: '操作',
      minWidth: 240,
      type: 'actions',
      getActions: (params: GridRowParams) => {
        const { id } = params.row;
        return [
          <GridActionsCellItem
            key={params.row.id + '查看日志'}
            icon={
              <Tooltip title="查看日志" placement="top-start">
                <EventNoteIcon
                  onClick={() => {
                    getJobLog(id);
                  }}
                />
              </Tooltip>
            }
            label="查看日志"
          />
        ];
      }
    }
  ];

  return (
    <div className={classes.itemPage} ref={divRef} style={{ overflowY: 'scroll' }}>
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
      {isShowLogList ? (
        <div style={{ width: '100%', height: '100%', margin: '0 auto', marginTop: '40px' }}>
          <Card style={{ width: '100%', height: '100%', margin: '0 auto', marginTop: '20px' }}>
            <OmsTableServer getDataApi={jobLogListApi} dataId={isShowLogList} columns={columnsLog} />
          </Card>
        </div>
      ) : null}
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
