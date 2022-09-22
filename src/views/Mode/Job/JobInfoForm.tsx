import React, { Dispatch, SetStateAction } from 'react';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { GroupInfo, HostInfo, JobInfo, PlayerInfo, TagInfo } from '../../../store/interface';

type tProps = {
  Info: JobInfo;
  execute: {
    host: HostInfo[];
    tag: TagInfo[];
    group: GroupInfo[];
  };
  playerList: PlayerInfo[];
  setInfo: Dispatch<SetStateAction<JobInfo>>;
};

type tTargetList = HostInfo[] | TagInfo[] | GroupInfo[];

const JobInfoForm = ({ Info, setInfo, execute, playerList }: tProps) => {
  const targetList: tTargetList = execute[Info.execute_type];

  return (
    <>
      <TextField
        autoFocus
        margin="dense"
        id="job-spec"
        label="cron表达式"
        placeholder="例: */10 * * * * *"
        fullWidth
        value={Info.spec}
        onChange={(e) => setInfo({ ...Info, spec: e.target.value })}
      />
      <FormControl style={{ width: '100%' }}>
        <InputLabel id="job-select-target-type">选择执行对象类型</InputLabel>
        <Select
          labelId="job-select-label"
          id="job-select"
          value={Info.execute_type}
          onChange={(e) => setInfo({ ...Info, execute_type: e.target.value as 'host' | 'group' | 'tag' })}>
          <MenuItem value={'host'}>主机</MenuItem>
          <MenuItem value={'group'}>分组</MenuItem>
          <MenuItem value={'tag'}>标签</MenuItem>
        </Select>
      </FormControl>
      <FormControl style={{ width: '100%' }}>
        <InputLabel id="job-select-target">选择执行对象</InputLabel>
        <Select
          labelId="hostid-select-label"
          id="hostid-select"
          value={Info.execute_id}
          onChange={(e) => setInfo({ ...Info, execute_id: e.target.value as number })}>
          {targetList?.map((e) => {
            return (
              <MenuItem key={e.id} value={e.id}>
                {e.name}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
      <FormControl style={{ width: '100%' }}>
        <InputLabel id="job-select-cmd-type">选择命令类型</InputLabel>
        <Select
          labelId="job-select-label"
          id="job-select"
          value={Info.cmd_type}
          onChange={(e) => setInfo({ ...Info, cmd_type: e.target.value as 'cmd' | 'player' })}>
          <MenuItem value={'cmd'}>cmd</MenuItem>
          <MenuItem value={'player'}>剧本</MenuItem>
        </Select>
      </FormControl>
      {Info.cmd_type === 'cmd' ? (
        <TextField
          autoFocus
          margin="dense"
          id="job-cmd"
          label="cmd命令"
          fullWidth
          value={Info.cmd}
          onChange={(e) => setInfo({ ...Info, cmd: e.target.value })}
        />
      ) : (
        <FormControl style={{ width: '100%' }}>
          <InputLabel id="job-select-target">选择剧本</InputLabel>
          <Select
            labelId="hostid-select-label"
            id="hostid-select"
            value={Info.cmd_id}
            onChange={(e) => setInfo({ ...Info, cmd_id: e.target.value as number })}>
            {playerList?.map((e) => {
              return (
                <MenuItem key={e.id} value={e.id}>
                  {e.name}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      )}
      <TextField
        autoFocus
        margin="dense"
        id="job-name"
        label="任务名称"
        fullWidth
        value={Info.name}
        onChange={(e) => setInfo({ ...Info, name: e.target.value })}
      />
    </>
  );
};

export default JobInfoForm;
