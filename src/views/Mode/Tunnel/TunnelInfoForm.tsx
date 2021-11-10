import React, { Dispatch, SetStateAction } from 'react';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { HostInfo, TunnelInfo } from '../../../store/interface';

type tProps = {
  Info: TunnelInfo,
  hostList: HostInfo[],
  setInfo: Dispatch<SetStateAction<TunnelInfo>>,
}


const TunnelInfoForm = ({ Info, hostList, setInfo }: tProps) => {
  return (
    <>
      <TextField
        autoFocus
        margin='dense'
        id='source'
        label='目标地址'
        fullWidth
        value={Info.source}
        onChange={(e) => setInfo({ ...Info, source: e.target.value })}
      />
      <TextField
        autoFocus
        margin='dense'
        id='destination'
        label='监听地址'
        fullWidth
        value={Info.destination}
        onChange={(e) => setInfo({ ...Info, destination: e.target.value })}
      />
      <FormControl style={{ width: '100%' }}>
        <InputLabel id='mode-select-label'>选择隧道模式 </InputLabel>
        <Select
          labelId='mode-select-label'
          id='mode-select'
          value={Info.mode}
          onChange={(e) => setInfo({ ...Info, mode: e.target.value as ('local'| 'remote') })}
        >
          <MenuItem value={'local'}>local</MenuItem>
          <MenuItem value={'remote'}>remote</MenuItem>
        </Select>
      </FormControl>
      <FormControl style={{ width: '100%' }}>
        <InputLabel id='host_id-select-label'>选择主机 </InputLabel>
        <Select
          labelId='host_id-select-label'
          id='host_id-select'
          value={Info.host_id}
          onChange={(e) => setInfo({ ...Info, host_id: e.target.value as number })}
        >{hostList && hostList.map((e) => (
            <MenuItem key={e.id} value={e.id}>{e.name}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </>);
};

export default TunnelInfoForm;
