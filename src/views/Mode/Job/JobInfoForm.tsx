import React, { Dispatch, SetStateAction } from 'react';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { JobInfo } from '../../../store/interface';

type tProps = {
  Info: JobInfo,
  setInfo: Dispatch<SetStateAction<JobInfo>>,
}


const JobInfoForm = ({ Info, setInfo }: tProps) => {
  return (
    <>
      <TextField
        autoFocus
        margin='dense'
        id='job-name'
        label='job名称'
        fullWidth
        value={Info.name}
        onChange={(e) => setInfo({ ...Info, name: e.target.value })}
      />
      <TextField
        autoFocus
        margin='dense'
        id='job-spec'
        label='cron表达式'
        fullWidth
        value={Info.spec}
        onChange={(e) => setInfo({ ...Info, spec: e.target.value })}
      />
      <TextField
        autoFocus
        margin='dense'
        id='job-cmd'
        label='命令'
        fullWidth
        value={Info.cmd}
        onChange={(e) => setInfo({ ...Info, cmd: e.target.value })}
      />
      <FormControl style={{ width: '100%' }}>
        <InputLabel id='job-select-label'>选择job类型</InputLabel>
        <Select
          labelId='job-select-label'
          id='job-select'
          value={Info.type}
          onChange={(e) => setInfo({ ...Info, type: e.target.value as ('cron'| 'task') })}
        >
          <MenuItem value={'cron'}>cron</MenuItem>
          <MenuItem value={'task'}>task</MenuItem>
        </Select>
      </FormControl>
    </>);
};

export default JobInfoForm;
