import React, { Dispatch, SetStateAction } from 'react';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import AccountCircle from '@material-ui/icons/AccountCircle';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import { GroupInfo, HostInfo, TagInfo } from '../../store/interface';
import MenuItem from '@material-ui/core/MenuItem';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

type tProps = {
  hostInfo: HostInfo,
  setHostInfo: Dispatch<SetStateAction<HostInfo>>,
  groupList: GroupInfo[],
  tlc: Array<TagInfo & { checked: boolean }>,
  setTlc: Dispatch<SetStateAction<Array<TagInfo & { checked: boolean }>>>
}


const HostInfoForm = ({ hostInfo, setHostInfo, groupList, tlc, setTlc }: tProps) => {
  return (
    <>
      <TextField
        autoFocus
        margin='dense'
        id='host-name'
        label='主机名'
        fullWidth
        value={hostInfo.name}
        onChange={(e) => setHostInfo({ ...hostInfo, name: e.target.value })}
      />
      <TextField
        autoFocus
        margin='dense'
        id='host-ip'
        label='主机地址'
        fullWidth
        value={hostInfo.addr}
        onChange={(e) => setHostInfo({ ...hostInfo, addr: e.target.value })}
      />
      <TextField
        autoFocus
        margin='dense'
        id='user-name'
        label='用户名'
        fullWidth
        value={hostInfo.user}
        onChange={(e) => setHostInfo({ ...hostInfo, user: e.target.value })}
        InputProps={{
          startAdornment: (
            <InputAdornment position='start'>
              <AccountCircle />
            </InputAdornment>
          )
        }}
      />
      <TextField
        autoFocus
        margin='dense'
        id='port'
        label='端口号'
        fullWidth
        value={hostInfo.port}
        onChange={(e) => setHostInfo({ ...hostInfo, port: Number(e.target.value) })}
      />
      <TextField
        autoFocus
        margin='dense'
        id='password'
        label='请输入密码或key'
        fullWidth
        value={hostInfo.password}
        onChange={(e) => setHostInfo({ ...hostInfo, password: e.target.value })}
      />
      <FormControl style={{ width: '100%' }}>
        {groupList.length > 0 ? (<>
          <InputLabel id='group-select-label'>选择分组</InputLabel>
          <Select
            labelId='group-select-label'
            id='group-select'
            value={hostInfo.group.name}
            onChange={(e) => setHostInfo({ ...hostInfo, group: groupList.find((item) => item.name === e?.target?.value as string) as GroupInfo })}
          >
            {groupList.map((e) => {
              return (<MenuItem key={e.name} value={e.name}>{e.name}</MenuItem>);
            })}
          </Select>
        </>) : '请在分组页面添加分组才可以选择分组' }
      </FormControl>
      <FormControl style={{ width: '100%' }}>
        <FormGroup row>
          {tlc && tlc.map((e, index) => {
            return (
              <FormControlLabel
                key={e.name}
                control={
                  <Checkbox
                    checked={e.checked}
                    onChange={(event) => {
                      const arr = [...tlc];
                      arr.splice(index, 1, { ...e, checked: event.target.checked });
                      setTlc(arr);
                    }}
                    name={e.name}
                    color='primary'
                  />
                }
                label={e.name}
              />
            );
          })}
        </FormGroup>
      </FormControl>
    </>);
};

export default HostInfoForm;
