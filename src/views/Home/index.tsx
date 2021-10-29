import React, { useState } from 'react';
import { ActionCreator } from 'redux';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
// import DialogContentText from '@material-ui/core/DialogContentText';
import InputAdornment from '@material-ui/core/InputAdornment';
import AccountCircle from '@material-ui/icons/AccountCircle';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import actions from '../../store/action';
import BodyBox from '../../components/Bodybox';
import { hostInfo } from './typings';
import HostInfoCard from '../../components/HostInfoCard';
import { IState } from '../../store/interface';
import homeStyle from './homStyle';
import { useSnackbar } from 'notistack';

type tDP = {
  deleteHost: ActionCreator<any>;
  addHost: ActionCreator<any>;
};

type tOP = {};

type tSP = tOP & {
  hostList: hostInfo[],
};

const mapStateToProps = (state: IState, props: tOP): tSP => ({
  ...props,
  hostList: state.data,
});
const mapDispatch: tDP = {
  deleteHost: actions.deleteHostInfo,
  addHost: actions.addHostInfo,
};

type tProps = tSP & tDP;

function Home(props: tProps) {
  const { hostList, deleteHost, addHost } = props;
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
    console.log(host);
    console.log(hostName);
    console.log(port);
    console.log(user);
    console.log(password);
    console.log(group);
    console.log(tag);
    const data: hostInfo = {
      id: new Date().getTime(),
      host,
      port,
      user,
      group,
      status: hostStatus,
      tag,
      hostName,
    };
    addHost(data);
    setOpen(false);
    enqueueSnackbar(`主机: ${hostName} 已添加`, {
      autoHideDuration: 3000,
      variant: 'success',
    });
  };

  return (
    <BodyBox>
      <div className={classes.home}>
        {hostList.map((i: hostInfo) => {
          return (
            <HostInfoCard hostInfo={i} key={i.id} deleteHost={deleteHost}/>
          );
        })}
      </div>
      <Fab
        variant="extended"
        size="medium"
        color="primary"
        aria-label="add"
        className={classes.FabButton}
        onClick={handleClickOpen}
      >
        <AddIcon />
        添加主机
      </Fab>
      <Dialog open={open} onClose={handleClose} aria-labelledby="add-host-dialog">
        <DialogTitle id="add-host-dialog">添加一个新的主机</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="host-name"
            label="主机名"
            fullWidth
            onChange={(e) => setHostName(e.target.value)}
          />
          <TextField
            autoFocus
            margin="dense"
            id="host-ip"
            label="主机地址"
            fullWidth
            onChange={(e) => setHost(e.target.value)}
          />
          <TextField
            autoFocus
            margin="dense"
            id="user-name"
            label="用户名"
            fullWidth
            onChange={(e) => setUser(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccountCircle />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            autoFocus
            margin="dense"
            id="port"
            label="端口号"
            fullWidth
            onChange={(e) => setPort(e.target.value)}
          />
          <TextField
            autoFocus
            margin="dense"
            id="password"
            label="请输入密码或key"
            fullWidth
            onChange={(e) => setPassword(e.target.value)}
          />
          <TextField
            autoFocus
            margin="dense"
            id="group"
            label="分组名"
            fullWidth
            onChange={(e) => setGroup(e.target.value)}
          />
          <TextField
            autoFocus
            margin="dense"
            id="tag-name"
            label="标签名"
            fullWidth
            onChange={(e) => setTag(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            取消
          </Button>
          <Button onClick={addNewHost} color="primary">
            确认
          </Button>
        </DialogActions>
      </Dialog>
    </BodyBox>
  );
}

export default connect(
    mapStateToProps, // 把仓库的状态映射为组件的属性对象
    mapDispatch,
)(Home);
