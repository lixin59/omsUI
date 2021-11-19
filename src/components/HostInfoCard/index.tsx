import React, { useEffect, useState } from 'react';
import Chip from '@material-ui/core/Chip';
import { connect } from 'react-redux';
import actions from '../../store/action';

import {
  editHostApi,
  deleteHostApi,
  HTTPResult,
  EditHostPut
} from '../../api/http/httpRequestApi';
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
import styles from './style';
import { GroupInfo, TagInfo, HostInfo, IState } from '../../store/interface';
import HostInfoForm from './hostInfoForm';

// type tProps = {
//   hostInfo: HostInfo;
//   deleteHost: ActionCreator<any>;
//   editHost: ActionCreator<any>;
//   groupList: GroupInfo[];
//   tagList: TagInfo[];
// }

type tDP = {
  initGroup: ActionCreator<any>;
  initTag: ActionCreator<any>;
  deleteHost: ActionCreator<any>;
  addHost: ActionCreator<any>;
  editHost: ActionCreator<any>;
  initStore: ActionCreator<any>;
};

type tOP = {};

type tSP = tOP & {
  hostList: HostInfo[],
  groupList: GroupInfo[],
  tagList: TagInfo[]
};

const mapStateToProps = (state: IState, props: tOP): tSP => ({
  ...props,
  hostList: state.hostList,
  groupList: state.groupList,
  tagList: state.tagList
});
const mapDispatch: tDP = {
  initGroup: actions.initGroupInfo,
  initTag: actions.initTagInfo,
  deleteHost: actions.deleteHostInfo,
  addHost: actions.addHostInfo,
  editHost: actions.editHostInfo,
  initStore: actions.initHostInfo
};

type tProps = tSP & tDP & {
  hostInfo: HostInfo;
};


function HostInfoCard(props: tProps) {
  const { hostInfo, deleteHost, editHost, groupList, tagList } = props;
  const classes = makeStyles(styles)();
  const { enqueueSnackbar } = useSnackbar();
  const titles: string = '确定要删除这台主机吗？';
  const text: string = '如果是不小心点到了删除按钮请点击取消，否则请你考虑清楚在决定是否要删除，后果自负！！！';

  const [open, setOpen] = useState<boolean>(false);
  const [isOpen, setIsoOpen] = useState<boolean>(false);
  const [hosts, setHosts] = useState<HostInfo>(hostInfo);
  const [tlc, setTlc] = useState(tagList?.map((e) => ({ ...e, checked: !!hostInfo.tags?.find((item) => item.name === e.name) })));

  useEffect(() => {
    setTlc(tagList?.map((e) => ({ ...e, checked: !!hostInfo.tags?.find((item) => item.name === e.name) })));
  }, [tagList]);

  const title = '编辑主机信息';
  const content = HostInfoForm({ hostInfo: hosts, setHostInfo: setHosts, groupList, tlc, setTlc });


  const closeDialog = () => {
    setOpen(false);
    // setIsoOpen(false);
  };

  const closeEditDialog = () => {
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

  const editNewHost = async() => {
    const tags: TagInfo[] = [];
    tlc.forEach((e) => {
      if (e.checked) {
        tags.push(e);
      }
    });
    const resData: EditHostPut = {
      id: hosts.id,
      hostname: hosts.name,
      user: hosts.user,
      addr: hosts.addr,
      port: hosts.port,
      password: hosts.password || '',
      keyFile: hosts.keyFile,
      group: hosts?.group?.id,
      tags: JSON.stringify((tags?.map((e) => e.id)))
    };
    const res = (await editHostApi(resData)) as HTTPResult;

    if (res.code !== '200') {
      enqueueSnackbar(`主机修改失败: ${res.msg}`, {
        autoHideDuration: 3000,
        variant: 'error'
      });
      return;
    }
    editHost(res.data);
    enqueueSnackbar(`主机: ${hostInfo.name} 信息已经修改`, {
      autoHideDuration: 3000,
      variant: 'success'
    });
  };

  const onDelete = async() => {
    const res = (await deleteHostApi(hostInfo.id) as HTTPResult);
    // console.log(res);
    if (res.code !== '200') {
      enqueueSnackbar(`主机${hostInfo.name}删除失败: ${res.msg}`, {
        autoHideDuration: 3000,
        variant: 'error'
      });
      return;
    }
    deleteHost(hostInfo.id);
    enqueueSnackbar(`主机: ${hostInfo.name} 已被删除`, {
      autoHideDuration: 3000,
      variant: 'success'
    });
  };

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
            <ListItemText primary={hostInfo.addr || ''} />
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
            <ListItemText
              primary={hostInfo.tags?.map((e) => (
                <Chip
                  className={classes.tag}
                  size='small'
                  key={e.id}
                  label={e.name}
                />))}
            />
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
//
// export default HostInfoCard;

export default connect(
  mapStateToProps, // 把仓库的状态映射为组件的属性对象
  mapDispatch
)(HostInfoCard);
