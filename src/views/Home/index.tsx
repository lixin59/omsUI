import React, { useState } from 'react';
import { ActionCreator } from 'redux';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import AccountCircle from '@material-ui/icons/AccountCircle';
import actions from '../../store/action';
import BodyBox from '../../components/Bodybox';
import { hostInfo } from './typings';
import HostInfoCard from '../../components/HostInfoCard';
import { GroupInfo, IState, TagInfo } from '../../store/interface';
import homeStyle from './homStyle';
import FormDialog from '../../components/OmsDialog/FormDialog';
import { useSnackbar } from 'notistack';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

type tDP = {
  deleteHost: ActionCreator<any>;
  addHost: ActionCreator<any>;
  editHost: ActionCreator<any>;
};

type tOP = {};

type tSP = tOP & {
  hostList: hostInfo[],
  groupList: GroupInfo[],
  tagList: TagInfo[]
};

const mapStateToProps = (state: IState, props: tOP): tSP => ({
  ...props,
  hostList: state.hostList,
  groupList: state.groupList,
  tagList: state.tagList,
});
const mapDispatch: tDP = {
  deleteHost: actions.deleteHostInfo,
  addHost: actions.addHostInfo,
  editHost: actions.editHostInfo,
};

type tProps = tSP & tDP;

function Home(props: tProps) {
  const { hostList, deleteHost, addHost, editHost, groupList, tagList } = props;
  const classes = makeStyles(homeStyle)();
  const { enqueueSnackbar } = useSnackbar();

  const [open, setOpen] = useState<boolean>(false);
  const [hostStatus, setHostStatus] = useState<boolean>(false);
  const [hostName, setHostName] = useState<string>('');
  const [host, setHost] = useState<string>('');
  const [port, setPort] = useState<string>('');
  const [user, setUser] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [group, setGroup] = useState<string>('');
  const [tag, setTag] = useState<string>('');

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const addNewHost = () => {
    if (!host) {
      enqueueSnackbar(`主机地址不能为空`, {
        autoHideDuration: 3000,
        variant: 'error',
      });
      return;
    }
    if (!user) {
      enqueueSnackbar(`主机名不能为空`, {
        autoHideDuration: 3000,
        variant: 'error',
      });
      return;
    }
    if (!hostName) {
      enqueueSnackbar(`用户名不能为空`, {
        autoHideDuration: 3000,
        variant: 'error',
      });
      return;
    }
    const data: hostInfo = {
      id: new Date().getTime(),
      host,
      port,
      user,
      group,
      status: hostStatus,
      password,
      tag,
      hostName,
    };
    addHost(data);
    enqueueSnackbar(`主机: ${hostName} 已添加`, {
      autoHideDuration: 3000,
      variant: 'success',
    });
  };
  const title = '添加一个新的主机';
  const content = (<>
    <TextField
      autoFocus
      margin='dense'
      id='host-name'
      label='主机名'
      fullWidth
      onChange={(e) => setHostName(e.target.value)}
    />
    <TextField
      autoFocus
      margin='dense'
      id='host-ip'
      label='主机地址'
      fullWidth
      onChange={(e) => setHost(e.target.value)}
    />
    <TextField
      autoFocus
      margin='dense'
      id='user-name'
      label='用户名'
      fullWidth
      onChange={(e) => setUser(e.target.value)}
      InputProps={{
        startAdornment: (
          <InputAdornment position='start'>
            <AccountCircle />
          </InputAdornment>
        ),
      }}
    />
    <TextField
      autoFocus
      margin='dense'
      id='port'
      label='端口号'
      fullWidth
      onChange={(e) => setPort(e.target.value)}
    />
    <TextField
      autoFocus
      margin='dense'
      id='password'
      label='请输入密码或key'
      fullWidth
      onChange={(e) => setPassword(e.target.value)}
    />
    <FormControl className={classes.Select}>
      {groupList.length > 0 ? (<>
        <InputLabel id='group-select-label'>选择分组</InputLabel>
        <Select
          labelId='group-select-label'
          id='group-select'
          value={group}
          onChange={(e) => setGroup(e?.target?.value as string)}
        >
          {groupList.map((e) => {
            return (<MenuItem key={e.name} value={e.name}>{e.name}</MenuItem>);
          })}
        </Select>
      </>) : '请在分组页面添加分组才可以选择分组' }
    </FormControl>
    <FormControl className={classes.Select}>
      { tagList.length > 0 ? (<>
        <InputLabel id='tag-select-label'>选择标签</InputLabel>
        <Select
          labelId='tag-select-label'
          id='tag-select'
          value={tag}
          onChange={(e) => setTag(e?.target?.value as string)}
        >
          {tagList.map((e) => {
            return (<MenuItem key={e.name} value={e.name}>{e.name}</MenuItem>);
          })}
        </Select>
      </>) : '请在分组页面添加标签才可以选择标签'}
    </FormControl>
  </>);

  return (
    <BodyBox>
      <div className={classes.home}>
        {hostList.map((i: hostInfo) => {
          return (
            <HostInfoCard
              hostInfo={i}
              key={i.id}
              deleteHost={deleteHost}
              editHost={editHost}
              groupList={groupList}
              tagList={tagList}
            />
          );
        })}
      </div>
      <Fab
        variant='extended'
        size='medium'
        color='primary'
        aria-label='add'
        className={classes.FabButton}
        onClick={handleClickOpen}
      >
        <AddIcon />
        添加主机
      </Fab>
      <FormDialog
        open={open}
        content={content}
        toClose={handleClose}
        title={title}
        todo={addNewHost}
      />
    </BodyBox>
  );
}

export default connect(
  mapStateToProps, // 把仓库的状态映射为组件的属性对象
  mapDispatch,
)(Home);
