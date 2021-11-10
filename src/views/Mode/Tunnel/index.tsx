import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TunnelTable from './TunnelTable';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import styles from './style';
import { ActionCreator } from 'redux';
import { useSnackbar } from 'notistack';
import { connect } from 'react-redux';
import { HostInfo, IState, TunnelInfo } from '../../../store/interface';
import actions from '../../../store/action';

type tDP = {
  deleteTunnel: ActionCreator<any>;
  addTunnel: ActionCreator<any>;
  editTunnel: ActionCreator<any>;
};

type tOP = {};

type tSP = tOP & {
  tunnelList: TunnelInfo[],
  hostList: HostInfo[]
};

const mapStateToProps = (state: IState, props: tOP): tSP => ({
  ...props,
  tunnelList: state.tunnelList,
  hostList: state.hostList
});
const mapDispatch: tDP = {
  deleteTunnel: actions.deleteTunnelInfo,
  addTunnel: actions.addTunnelInfo,
  editTunnel: actions.editTunnelInfo
};

type tProps = tSP & tDP;

const TunnelPage = ({ hostList, tunnelList, addTunnel, editTunnel, deleteTunnel }: tProps) => {
  const classes = makeStyles(styles)();
  const { enqueueSnackbar } = useSnackbar();
  const [mode, setMode] = useState<string | number>('');
  const [hostId, setHost] = useState<string | number>('');
  const [src, setSrc] = useState<string>('');
  const [dest, setDest] = useState<string>('');

  const addNew = () => {
    if (mode === '') {
      enqueueSnackbar(`请选择一个模式！`, {
        autoHideDuration: 3000,
        variant: 'warning'
      });
      return;
    }
    if (!dest) {
      enqueueSnackbar(`监听地址不能为空！`, {
        autoHideDuration: 3000,
        variant: 'warning'
      });
      return;
    }
    if (tunnelList.some((e) => e.destination === dest)) {
      enqueueSnackbar(`该Tunnel已存在！`, {
        autoHideDuration: 3000,
        variant: 'warning'
      });
      return;
    }
    addTunnel({ id: new Date().getTime(), mode, source: src, destination: dest, status: false, error_msg: 'success', host_id: hostId });
  };

  return (
    <div className={classes.itemPage}>
      <div className={classes.ControlBox}>
        <FormControl className={classes.Control}>
          <InputLabel id='job-select-label'>选择隧道模式</InputLabel>
          <Select
            labelId='job-select-label'
            id='job-select'
            value={mode}
            onChange={(e) => setMode(e.target.value as string)}
          >
            <MenuItem value={'local'}>local</MenuItem>
            <MenuItem value={'remote'}>remote</MenuItem>
          </Select>
        </FormControl>
        <FormControl className={classes.Control}>
          <InputLabel id='hostid-select-label'>选择主机</InputLabel>
          <Select
            labelId='hostid-select-label'
            id='hostid-select-tunnel'
            value={hostId}
            onChange={(e) => setHost(e.target.value as string)}
          >
            {hostList.map((e) => {
              return (<MenuItem key={e.id} value={e.id}>{e.name}</MenuItem>);
            })}
          </Select>
        </FormControl>
        <FormControl className={classes.Control}>
          <TextField
            size='small'
            id='src-tunnel'
            label='目标地址'
            variant='outlined'
            value={src}
            onChange={(e) => setSrc(e.target.value)}
          />
        </FormControl>
        <FormControl className={classes.Control}>
          <TextField
            size='small'
            label='监听地址'
            id='dest-tunnel'
            variant='outlined'
            value={dest}
            onChange={(e) => setDest(e.target.value)}
          />
        </FormControl>
        <Button
          className={classes.addButton}
          onClick={addNew}
        >
          增加隧道
        </Button>
      </div>
      <div className={classes.shellBox}>
        <TunnelTable deleteTunnel={deleteTunnel} tunnelList={tunnelList} editTunnel={editTunnel}/>
      </div>
    </div>
  );
};

export default connect(
  mapStateToProps,
  mapDispatch
)(TunnelPage);
