import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import styles from './style';
import { ActionCreator } from 'redux';
import { useSnackbar } from 'notistack';
import { connect } from 'react-redux';
import JobTable from './JobTable';
import { HostInfo, IState, JobInfo } from '../../../store/interface';
import actions from '../../../store/action';
import { addJobApi, getJobsApi, HTTPResult } from '../../../api/http/httpRequestApi';

type tDP = {
  toInit: ActionCreator<any>;
  deleteJob: ActionCreator<any>;
  addJob: ActionCreator<any>;
  editJob: ActionCreator<any>;
};

type tOP = {};

type tSP = tOP & {
  jobList: JobInfo[],
  hostList: HostInfo[]
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

const JobPage = ({ hostList, jobList, addJob, editJob, deleteJob, toInit }: tProps) => {

  useEffect(() => {
    (async() => {
      const res = (await getJobsApi()) as HTTPResult;
      if (res.code !== '200') {
        return;
      }
      toInit(res.data);
    })();
  }, []);

  const classes = makeStyles(styles)();
  const { enqueueSnackbar } = useSnackbar();
  const [type, setType] = useState<string | number>('');
  const [hostId, setHost] = useState<string | number>('');
  const [spec, setSpec] = useState<string>('');
  const [cmd, setCmd] = useState<string>('');
  const [name, setName] = useState<string>('');

  const addNewJob = async() => {
    if (type === '') {
      enqueueSnackbar(`请选择一个类型！`, {
        autoHideDuration: 3000,
        variant: 'warning'
      });
      return;
    }
    if (type === 'cron' && !spec) {
      enqueueSnackbar(`选中cron类型, cron表达式不能为空！`, {
        autoHideDuration: 3000,
        variant: 'warning'
      });
      return;
    }
    if (!name) {
      enqueueSnackbar(`job名称不能为空！`, {
        autoHideDuration: 3000,
        variant: 'warning'
      });
      return;
    }
    if (jobList.some((e) => e.name === name)) {
      enqueueSnackbar(`该Job已存在！`, {
        autoHideDuration: 3000,
        variant: 'warning'
      });
      return;
    }
    const res = (await addJobApi({ name, type: type as 'cron' | 'task', spec, cmd, host_id: hostId as number })) as HTTPResult;
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
  };

  return (
    <div className={classes.itemPage}>
      <div className={classes.ControlBox}>
        <FormControl className={classes.Control}>
          <InputLabel id='job-select-label'>选择job类型</InputLabel>
          <Select
            labelId='job-select-label'
            id='job-select'
            value={type}
            onChange={(e) => setType(e.target.value as string)}
          >
            <MenuItem value={'cron'}>cron</MenuItem>
            <MenuItem value={'task'}>task</MenuItem>
          </Select>
        </FormControl>
        <FormControl className={classes.Control}>
          <InputLabel id='hostid-select-label'>选择主机</InputLabel>
          <Select
            labelId='hostid-select-label'
            id='hostid-select'
            value={hostId}
            onChange={(e) => setHost(e.target.value as string)}
          >
            {hostList.map((e) => {
              return (<MenuItem key={e.id} value={e.id}>{e.name}</MenuItem>);
            })}
          </Select>
        </FormControl>
        <FormControl className={classes.Control}>
          <TextField
            size='small'
            id='cron-job'
            label='cron表达式'
            variant='outlined'
            value={spec}
            placeholder='task类型不用添加规则'
            onChange={(e) => setSpec(e.target.value)}
          />
        </FormControl>
        <FormControl className={classes.Control}>
          <TextField
            size='small'
            label='Job名称'
            id='name-job'
            variant='outlined'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </FormControl>
        <FormControl className={classes.Control}>
          <TextField
            size='small'
            label='命令'
            id='cmd-job'
            variant='outlined'
            value={cmd}
            onChange={(e) => setCmd(e.target.value)}
          />
        </FormControl>
        <Button
          className={classes.addButton}
          onClick={addNewJob}
        >
          增加任务
        </Button>
      </div>
      <div className={classes.shellBox}>
        <JobTable jobList={jobList} deleteJob={deleteJob} editJob={editJob}/>
      </div>
    </div>
  );
};

export default connect(
  mapStateToProps,
  mapDispatch
)(JobPage);
