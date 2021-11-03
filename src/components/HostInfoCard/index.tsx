import React, { useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import PowerIcon from '@material-ui/icons/Power';
import PowerOffIcon from '@material-ui/icons/PowerOff';
import { ActionCreator } from 'redux';
import { useSnackbar } from 'notistack';
import TipDialog from '../OmsDialog/TipDialog';
import FormDialog from '../OmsDialog/FormDialog';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import AccountCircle from '@material-ui/icons/AccountCircle';
import styles from './style';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { GroupInfo, TagInfo, HostInfo } from '../../store/interface';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

type tProps = {
  hostInfo: HostInfo;
  deleteHost: ActionCreator<any>;
  editHost: ActionCreator<any>;
  groupList: GroupInfo[];
  tagList: TagInfo[];
}

function HostInfoCard(props: tProps) {
  const { hostInfo, deleteHost, editHost, groupList, tagList } = props;
  const classes = makeStyles(styles)();
  const { enqueueSnackbar } = useSnackbar();
  const titles: string = '确定要删除这台主机吗？';
  const text: string = '如果是不小心点到了删除按钮请点击取消，否则请你考虑清楚在决定是否要删除，后果自负！！！';

  const [open, setOpen] = useState<boolean>(false);
  const [isOpen, setIsoOpen] = useState<boolean>(false);
  const [name, setHostName] = useState<string>(hostInfo.name);
  const [host, setHost] = useState<string>(hostInfo.host);
  const [port, setPort] = useState<string>(hostInfo.password);
  const [user, setUser] = useState<string>(hostInfo.user);
  const [password, setPassword] = useState<string>(hostInfo.password);
  const [group, setGroup] = useState< GroupInfo>(hostInfo.group);
  const [tlc, setTlc] = useState(tagList.map((e) => ({ ...e, checked: !!hostInfo.tag.find((item) => item.name === e.name) })));
  // const tagObj = {};
  // tagList.forEach((e) => {
  //   tagObj[e.name] = !!hostInfo.tag.find((item) => item.name === e.name);
  // });
  // const [tagCheck, setTagCheck] = useState(tagObj);

  const closeDialog = () => {
    console.log('o', open);
    setOpen(false);
    // setIsoOpen(false);
  };

  const closeEditDialog = () => {
    console.log('Is44', isOpen);
    setIsoOpen(false);
  };

  const openDialog = (type:string) => {
    if (type === 'edit') {
      setIsoOpen(true);
    }
    if (type === 'delete') {
      setOpen(true);
    }
  };

  const editNewHost = () => {
    const tag: TagInfo[] = [];
    tlc.forEach((e) => {
      if (e.checked) {
        tag.push(e);
      }
    });
    editHost({
      id: hostInfo.id,
      name,
      status: hostInfo.status,
      password,
      user,
      host,
      port,
      group,
      tag
    });
    enqueueSnackbar(`主机: ${hostInfo.name} 信息已经修改`, {
      autoHideDuration: 3000,
      variant: 'success'
    });
  };

  const onDelete = () => {
    deleteHost(hostInfo.id);
    enqueueSnackbar(`主机: ${hostInfo.name} 已被删除`, {
      autoHideDuration: 3000,
      variant: 'success'
    });
  };

  const title = '编辑主机信息';
  const content = (<>
    <TextField
      autoFocus
      margin='dense'
      id='host-name'
      label='主机名'
      fullWidth
      value={name}
      onChange={(e) => setHostName(e.target.value)}
    />
    <TextField
      autoFocus
      margin='dense'
      id='host-ip'
      label='主机地址'
      fullWidth
      value={host}
      onChange={(e) => setHost(e.target.value)}
    />
    <TextField
      autoFocus
      margin='dense'
      id='user-name'
      label='用户名'
      fullWidth
      value={user}
      onChange={(e) => setUser(e.target.value)}
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
      value={port}
      onChange={(e) => setPort(e.target.value)}
    />
    <TextField
      autoFocus
      margin='dense'
      id='password'
      label='请输入密码或key'
      fullWidth
      value={password}
      onChange={(e) => setPassword(e.target.value)}
    />
    <FormControl className={classes.Select}>
      {groupList.length > 0 ? (<><InputLabel id='group-select-label'>选择分组</InputLabel>
        <Select
          labelId='group-select-label'
          id='group-select'
          value={group.name}
          onChange={(e) => setGroup(groupList.find((item) => item.name === e?.target?.value as string) as GroupInfo)}
        >
          {groupList.map((e) => {
            return (<MenuItem key={e.name} value={e.name}>{e.name}</MenuItem>);
          })}
        </Select></>) : '请在分组页面添加分组才可以选择分组' }
    </FormControl>
    <FormControl className={classes.Select}>
      <FormGroup row>
        {tlc && tlc.map((e) => {
          return (
            <FormControlLabel
              key={e.name}
              control={
                <Checkbox
                  checked={e.checked}
                  onChange={(event) => setTlc(tlc.map((x) => {
                    if (x.name === e.name) {
                      x.checked = event.target.checked;
                    }
                    return x;
                  }))}
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
    <>
      <Card className={classes.HostInfoCard}>
        <Typography className={classes.title} color='textSecondary' gutterBottom>
          <Button className={classes.commandButton} variant='contained'>命令</Button>
          <Button
            className={classes.editButton}
            variant='contained'
            onClick={() => openDialog('edit')}
          >
            编辑
          </Button>
          <Button
            className={classes.deleteButton}
            onClick={() => openDialog('delete')}
          >
            删除
          </Button>
        </Typography>
        <Divider/>
        <List component='nav' aria-label='main mailbox folders'>
          <ListItem className={classes.listItem}>
            <ListItemText className={classes.listItemText} primary='主机名:' />
            <ListItemText primary={hostInfo.name || ''} />
          </ListItem>
          <ListItem className={classes.listItem}>
            <ListItemText className={classes.listItemText} primary='状态:' />
            <ListItemText style={{ color: hostInfo.status ? '#4bce21' : '#d90229' }}>
              { hostInfo.status ? (<PowerIcon/>) : (<PowerOffIcon/>) }
            </ListItemText>
          </ListItem>
          <ListItem className={classes.listItem}>
            <ListItemText className={classes.listItemText} primary='用户:' />
            <ListItemText primary={hostInfo.user || ''} />
          </ListItem>
          <ListItem className={classes.listItem}>
            <ListItemText className={classes.listItemText} primary='地址:' />
            <ListItemText primary={hostInfo.host || ''} />
          </ListItem>
          <ListItem className={classes.listItem}>
            <ListItemText className={classes.listItemText} primary='端口:' />
            <ListItemText primary={hostInfo.port || ''} />
          </ListItem>
          <ListItem className={classes.listItem}>
            <ListItemText className={classes.listItemText} primary='组:' />
            <ListItemText primary={hostInfo.group.name || ''} />
          </ListItem>
          <ListItem className={classes.listItem}>
            <ListItemText className={classes.listItemText} primary='标签:' />
            <ListItemText primary={`${hostInfo.tag.map((e) => { return e.name; })}` || ''} />
          </ListItem>
        </List>
      </Card>
      <TipDialog
        open={open}
        text={text}
        title={titles}
        toClose={closeDialog}
        todo={onDelete}
      />
      <FormDialog
        open={isOpen}
        content={content}
        toClose={closeEditDialog}
        title={title}
        todo={editNewHost}
      />
    </>
  );
}

export default HostInfoCard;
