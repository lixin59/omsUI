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
// import { hostInfo } from './typings';
import HostInfoCard from '../../components/HostInfoCard';
import { GroupInfo, IState, TagInfo, HostInfo } from '../../store/interface';
import homeStyle from './homStyle';
import FormDialog from '../../components/OmsDialog/FormDialog';
import { useSnackbar } from 'notistack';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import MenuItem from '@material-ui/core/MenuItem';

type tDP = {
  deleteHost: ActionCreator<any>;
  addHost: ActionCreator<any>;
  editHost: ActionCreator<any>;
};

type tOP = {};

type tSP = tOP & {
  hostList: HostInfo[],
  groupList: GroupInfo[],
  tagList: TagInfo[]
};

const baseHostInfo: HostInfo = {
  id: 0,
  name: '',
  status: false,
  user: '',
  password: '',
  host: '',
  port: '',
  group: {
    id: 0,
    name: '',
    mode: 0,
    rule: ''
  },
  tag: [{
    id: 0,
    name: ''
  }]
};

const mapStateToProps = (state: IState, props: tOP): tSP => ({
  ...props,
  hostList: state.hostList,
  groupList: state.groupList,
  tagList: state.tagList
});
const mapDispatch: tDP = {
  deleteHost: actions.deleteHostInfo,
  addHost: actions.addHostInfo,
  editHost: actions.editHostInfo
};

type tProps = tSP & tDP;

function Home(props: tProps) {
  const { hostList, deleteHost, addHost, editHost, groupList, tagList } = props;
  const classes = makeStyles(homeStyle)();
  const { enqueueSnackbar } = useSnackbar();

  const [open, setOpen] = useState<boolean>(false);
  const [hostInfo, setHostInfo] = useState<HostInfo>(baseHostInfo);
  const tagObj = {};
  tagList.forEach((e) => {
    tagObj[e.name] = false;
  });
  const [tagCheck, setTagCheck] = useState(tagObj);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const addNewHost = () => {
    if (!hostInfo.host) {
      enqueueSnackbar(`主机地址不能为空`, {
        autoHideDuration: 3000,
        variant: 'error'
      });
      return;
    }
    if (!hostInfo.user) {
      enqueueSnackbar(`主机名不能为空`, {
        autoHideDuration: 3000,
        variant: 'error'
      });
      return;
    }
    if (!hostInfo.name) {
      enqueueSnackbar(`用户名不能为空`, {
        autoHideDuration: 3000,
        variant: 'error'
      });
      return;
    }
    if (hostList.some((e) => e.host === hostInfo.host)) {
      enqueueSnackbar(`该主机已存在`, {
        autoHideDuration: 3000,
        variant: 'error'
      });
      return;
    }
    const tag: TagInfo[] = [];
    tagList.forEach((e: TagInfo) => {
      if (tagCheck[e.name]) {
        tag.push(e);
      }
    });
    const data: HostInfo = {
      ...hostInfo,
      id: new Date().getTime(),
      tag
    };
    /* const res = api();
    if(code !==200) {
      enqueueSnackbar(`主机添加失败: res.mes`, {
       autoHideDuration: 3000,
       variant: 'success'
      });
      return;
    }
    id = res.id;
    * */
    addHost(data);
    enqueueSnackbar(`主机: ${hostInfo.name} 已添加`, {
      autoHideDuration: 3000,
      variant: 'success'
    });
    setHostInfo(baseHostInfo);
    setTagCheck(tagObj);
  };
  const title = '添加一个新的主机';
  const content = (<>
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
      value={hostInfo.host}
      onChange={(e) => setHostInfo({ ...hostInfo, host: e.target.value })}
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
      onChange={(e) => setHostInfo({ ...hostInfo, port: e.target.value })}
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
    <FormControl className={classes.Select}>
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
    <FormControl className={classes.Select}>
      <FormGroup row>
        {tagList && tagList.map((e) => {
          return (
            <FormControlLabel
              key={e.name}
              control={
                <Checkbox
                  checked={tagCheck[e.name]}
                  onChange={(event) => setTagCheck({ ...tagCheck, [event.target.name]: event.target.checked })}
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

  return (
    <BodyBox>
      <div className={classes.home}>
        {hostList.map((i: HostInfo) => {
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
  mapDispatch
)(Home);
