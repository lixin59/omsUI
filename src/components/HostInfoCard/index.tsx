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
import { hostInfo } from '../../views/Home/typings';
import { ActionCreator } from 'redux';
import { useSnackbar } from 'notistack';
import TipDialog from '../OmsDialog/TipDialog';

type tProps = {
  hostInfo: hostInfo;
  deleteHost: ActionCreator<any>
}

const useStyles = makeStyles({
  root: {
    width: '400px',
    minWidth: 275,
  },
  listItem: {
    padding: 0,
    paddingLeft: '40px',
  },
  listItemText: {
    width: '4%',
  },
  title: {
    height: '40px',
    lineHeight: '30px',
    fontSize: 14,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  button: {
    width: '40px',
    height: '20px',
  },
});

function HostInfoCard(props: tProps) {
  const { hostInfo, deleteHost } = props;
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const title: string = '确定要删除这台主机吗？';
  const text: string = '如果是不小心点到了删除按钮请点击取消，否则请你考虑清楚在决定是否要删除，后果自负！！！';

  const [open, setOpen] = useState<boolean>(false);
  const closeDialog = () => {
    setOpen(false);
  };

  const openDialog = () => {
    setOpen(true);
    console.log(open);
  };

  const onDelete = () => {
    deleteHost(hostInfo.id);
    enqueueSnackbar(`主机: ${hostInfo.hostName} 已被删除`, {
      autoHideDuration: 3000,
      variant: 'success',
    });
  };

  return (
    <>
      <Card className={classes.root}>
        <Typography className={classes.title} color='textSecondary' gutterBottom>
          <Button className={classes.button} variant='contained'>命令</Button>
          <Button className={classes.button} variant='contained' color='primary'>
            编辑
          </Button>
          <Button
            className={classes.button}
            variant='contained'
            color='secondary'
            onClick={() => openDialog()}
          >
            删除
          </Button>
        </Typography>
        <Divider/>
        <List component='nav' aria-label='main mailbox folders'>
          <ListItem className={classes.listItem}>
            <ListItemText className={classes.listItemText} primary='主机名:' />
            <ListItemText primary={hostInfo.hostName || ''} />
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
            <ListItemText primary={hostInfo.group || ''} />
          </ListItem>
          <ListItem className={classes.listItem}>
            <ListItemText className={classes.listItemText} primary='标签:' />
            <ListItemText primary={hostInfo.tag || ''} />
          </ListItem>
        </List>
      </Card>
      <TipDialog
        open={open}
        text={text}
        title={title}
        toClose={closeDialog}
        todo={onDelete}
      />
      {/* <Dialog open={open} onClose={closeDialog} aria-labelledby='is-delete-host'>*/}
      {/*  <DialogTitle id='is-delete-host' style={{ backgroundColor: '#ecad5a' }}>确定要删除这台主机吗？</DialogTitle>*/}
      {/*  <DialogContent dividers>*/}
      {/*    <DialogContentText>*/}
      {/*      如果是不小心点到了删除按钮请点击取消，否则请你考虑清楚在决定是否要删除，后果自负！！！*/}
      {/*    </DialogContentText>*/}
      {/*  </DialogContent>*/}
      {/*  <DialogActions>*/}
      {/*    <Button onClick={closeDialog} color='primary'>*/}
      {/*      取消*/}
      {/*    </Button>*/}
      {/*    <Button onClick={onDelete} color='primary'>*/}
      {/*      确定*/}
      {/*    </Button>*/}
      {/*  </DialogActions>*/}
      {/* </Dialog>*/}
    </>
  );
}

export default HostInfoCard;
