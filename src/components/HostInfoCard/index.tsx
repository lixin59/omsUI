import React from 'react';

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

type tProps = {
  hostInfo: hostInfo
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
  const { hostInfo } = props;
  const classes = useStyles();
  return (
    <Card className={classes.root}>
      <Typography className={classes.title} color="textSecondary" gutterBottom>
        <Button className={classes.button} variant="contained">命令</Button>
        <Button className={classes.button} variant="contained" color="primary">
          编辑
        </Button>
        <Button className={classes.button} variant="contained" color="secondary">
          删除
        </Button>
      </Typography>
      <Divider/>
      <List component="nav" aria-label="main mailbox folders">
        <ListItem className={classes.listItem}>
          <ListItemText className={classes.listItemText} primary="主机名:" />
          <ListItemText primary={hostInfo.hostName} />
        </ListItem>
        <ListItem className={classes.listItem}>
          <ListItemText className={classes.listItemText} primary="状态:" />
          <ListItemText style={{ color: hostInfo.status ? '#4bce21' : '#d90229' }}>
            { hostInfo.status ? (<PowerIcon/>) : (<PowerOffIcon/>) }
          </ListItemText>
        </ListItem>
        <ListItem className={classes.listItem}>
          <ListItemText className={classes.listItemText} primary="用户:" />
          <ListItemText primary={hostInfo.user} />
        </ListItem>
        <ListItem className={classes.listItem}>
          <ListItemText className={classes.listItemText} primary="地址:" />
          <ListItemText primary={hostInfo.host} />
        </ListItem>
        <ListItem className={classes.listItem}>
          <ListItemText className={classes.listItemText} primary="端口:" />
          <ListItemText primary={hostInfo.port} />
        </ListItem>
        <ListItem className={classes.listItem}>
          <ListItemText className={classes.listItemText} primary="组:" />
          <ListItemText primary={hostInfo.group} />
        </ListItem>
        <ListItem className={classes.listItem}>
          <ListItemText className={classes.listItemText} primary="标签:" />
          <ListItemText primary={hostInfo.tag} />
        </ListItem>
      </List>
    </Card>
  );
}

export default HostInfoCard;
