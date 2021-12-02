import React, { Dispatch, SetStateAction, useState } from 'react';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import AccountCircle from '@material-ui/icons/AccountCircle';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import { GroupInfo, HostInfo, PrivateKeyInfo, TagInfo } from '../../store/interface';
import MenuItem from '@material-ui/core/MenuItem';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import Chip from '@material-ui/core/Chip';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    // keyFile: {
    //   marginTop: '10px',
    //   'display': 'flex',
    //   'alignContent': 'space-evenly',
    //   'alignItems': 'center',
    //   'justifyContent': 'space-between'
    //   // '& > *': {
    //   //   margin: theme.spacing(1)
    //   // }
    // },
    // input: {
    //   display: 'none'
    // },
    tag: {
      marginRight: '4px',
      backgroundColor: theme.palette.tag.main
    }
  })
);

type tProps = {
  hostInfo: HostInfo,
  setHostInfo: Dispatch<SetStateAction<HostInfo>>,
  groupList: GroupInfo[],
  privateKeyList: PrivateKeyInfo[],
  tlc: Array<TagInfo & { checked: boolean }>,
  setTlc: Dispatch<SetStateAction<Array<TagInfo & { checked: boolean }>>>
}

interface PassWordState {
  amount: string;
  password: string;
  weight: string;
  weightRange: string;
  showPassword: boolean;
}

const HostInfoForm = ({ hostInfo, setHostInfo, groupList, privateKeyList, tlc, setTlc }: tProps) => {
  const classes = useStyles();
  // const [fileName, setFileName] = useState<string>('未选择任何文件');
  const [values, setValues] = React.useState<PassWordState>({
    amount: '',
    password: '',
    weight: '',
    weightRange: '',
    showPassword: false
  });

  const groupArr: GroupInfo[] = [{ id: 0, name: '无', mode: 1, params: '' }, ...groupList];
  const privateKeyArr: PrivateKeyInfo[] = [{ id: 0, name: '无', passphrase: '', key_file: '' }, ...privateKeyList];
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
      {/* <TextField*/}
      {/*  autoFocus*/}
      {/*  margin='dense'*/}
      {/*  id='password'*/}
      {/*  label='请输入密码'*/}
      {/*  fullWidth*/}
      {/*  value={hostInfo.password || ''}*/}
      {/*  onChange={(e) => setHostInfo({ ...hostInfo, password: e.target.value })}*/}
      {/* />*/}
      <FormControl style={{ width: '100%' }}>
        <InputLabel htmlFor='standard-adornment-password'>Password</InputLabel>
        <Input
          id='standard-adornment-password'
          type={values.showPassword ? 'text' : 'password'}
          value={hostInfo.password || ''}
          onChange={(e) => setHostInfo({ ...hostInfo, password: e.target.value })}
          endAdornment={
            <InputAdornment position='end'>
              <IconButton
                aria-label='toggle password visibility'
                onClick={() => setValues({ ...values, showPassword: !values.showPassword }) }
                onMouseDown={(event) => event.preventDefault()}
              >
                {values.showPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          }
        />
      </FormControl>
      <FormControl style={{ width: '100%' }}>
        {groupArr.length > 0 ? (<>
          <InputLabel id='group-select-label'>选择分组</InputLabel>
          <Select
            labelId='group-select-label'
            id='group-select'
            value={hostInfo.group.name}
            onChange={(e) => setHostInfo({ ...hostInfo, group: groupArr.find((item) => item.name === e?.target?.value as string) as GroupInfo })}
          >
            {groupArr.map((e) => {
              return (<MenuItem key={e.name} value={e.name}>{e.name}</MenuItem>);
            })}
          </Select>
        </>) : '请在分组页面添加分组才可以选择分组' }
      </FormControl>
      <FormControl style={{ width: '100%' }}>
        {privateKeyArr.length > 0 ? (<>
          <InputLabel id='group-select-label'>选择密钥文件</InputLabel>
          <Select
            labelId='group-select-label'
            id='group-select'
            value={hostInfo.private_key_id}
            onChange={(e) => setHostInfo({ ...hostInfo, private_key_id: e?.target?.value as number })}
          >
            {privateKeyArr.map((e) => {
              return (<MenuItem key={e.id} value={e.id}>{e.name}</MenuItem>);
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
                label={<Chip
                  className={classes.tag}
                  size='small'
                  key={e.id}
                  label={e.name}
                />}
              />
            );
          })}
        </FormGroup>
      </FormControl>
      <Divider/>
    </>);
};

export default HostInfoForm;
