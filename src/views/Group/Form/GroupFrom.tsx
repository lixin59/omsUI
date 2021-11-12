import React, { Dispatch, SetStateAction } from 'react';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { GroupInfo } from '../../../store/interface';

type tProps = {
  Info: GroupInfo,
  setInfo: Dispatch<SetStateAction<GroupInfo>>,
}


const GroupForm = ({ Info, setInfo }: tProps) => {
  return (
    <>
      <FormControl style={{ width: '100%' }}>
        <InputLabel id='job-select-label'>选择模式</InputLabel>
        <Select
          labelId='job-select-label'
          id='group-select'
          value={Info.mode}
          onChange={(e) => setInfo({ ...Info, mode: Number(e.target.value) as (0 | 1) })}
        >
          <MenuItem value={0}>主机模式</MenuItem>
          <MenuItem value={1}>规则模式</MenuItem>
        </Select>
      </FormControl>
      <TextField
        autoFocus
        margin='dense'
        id='group-name'
        label='分组名称'
        fullWidth
        value={Info.name}
        onChange={(e) => setInfo({ ...Info, name: e.target.value })}
      />
      <TextField
        autoFocus
        margin='dense'
        id='params'
        label='匹配规则'
        fullWidth
        value={Info.params}
        onChange={(e) => setInfo({ ...Info, params: e.target.value })}
      />
    </>);
};

export default GroupForm;
