import React, { useEffect, useState } from 'react';
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
import { addTunnelApi, getTunnelsApi, HTTPResult } from '../../../api/http/httpRequestApi';

type tDP = {
  toInit: ActionCreator<any>;
  deleteTunnel: ActionCreator<any>;
  addTunnel: ActionCreator<any>;
  editTunnel: ActionCreator<any>;
};

// eslint-disable-next-line @typescript-eslint/ban-types
type tOP = {};

type tSP = tOP & {
  tunnelList: TunnelInfo[];
  hostList: HostInfo[];
};

const mapStateToProps = (state: IState, props: tOP): tSP => ({
  ...props,
  tunnelList: state.tunnelList,
  hostList: state.hostList
});
const mapDispatch: tDP = {
  toInit: actions.initTunnelInfo,
  deleteTunnel: actions.deleteTunnelInfo,
  addTunnel: actions.addTunnelInfo,
  editTunnel: actions.editTunnelInfo
};

type tProps = tSP & tDP;

const TunnelPage = ({ hostList, tunnelList, addTunnel, editTunnel, deleteTunnel, toInit }: tProps) => {
  useEffect(() => {
    (async () => {
      // console.log('tunnelEff');
      const res = (await getTunnelsApi()) as HTTPResult;
      if (res.code !== '200') {
        return;
      }
      toInit(res.data);
    })();
  }, []);

  const classes = makeStyles(styles)();
  const { enqueueSnackbar } = useSnackbar();
  const [mode, setMode] = useState<string>('');
  const [hostId, setHost] = useState<string | number>('');
  const [source, setSrc] = useState<string>('');
  const [destination, setDest] = useState<string>('');

  const addNew = async () => {
    if (mode === '') {
      enqueueSnackbar(`????????????????????????`, {
        autoHideDuration: 3000,
        variant: 'warning'
      });
      return;
    }
    if (!destination) {
      enqueueSnackbar(`???????????????????????????`, {
        autoHideDuration: 3000,
        variant: 'warning'
      });
      return;
    }
    const res = (await addTunnelApi({
      mode: mode as 'local' | 'remote',
      source,
      destination,
      host_id: hostId as number
    })) as HTTPResult;
    if (res.code !== '200') {
      enqueueSnackbar(`??????????????????${res.msg}`, {
        autoHideDuration: 3000,
        variant: 'error'
      });
      return;
    }
    addTunnel(res.data);
  };

  return (
    <div className={classes.itemPage}>
      <div className={classes.ControlBox}>
        <FormControl className={classes.Control}>
          <InputLabel id="job-select-label">??????????????????</InputLabel>
          <Select
            labelId="job-select-label"
            id="job-select"
            value={mode}
            onChange={(e) => setMode(e.target.value as string)}>
            <MenuItem value={'local'}>local</MenuItem>
            <MenuItem value={'remote'}>remote</MenuItem>
          </Select>
        </FormControl>
        <FormControl className={classes.Control}>
          <InputLabel id="hostid-select-label">????????????</InputLabel>
          <Select
            labelId="hostid-select-label"
            id="hostid-select-tunnel"
            value={hostId}
            onChange={(e) => setHost(e.target.value as number)}>
            {hostList.map((e) => {
              return (
                <MenuItem key={e.id} value={e.id}>
                  {e.name}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
        <FormControl className={classes.Control}>
          <TextField
            size="small"
            id="src-tunnel"
            label="?????????"
            variant="outlined"
            value={source}
            onChange={(e) => setSrc(e.target.value)}
          />
        </FormControl>
        <FormControl className={classes.Control}>
          <TextField
            size="small"
            label="????????????"
            id="dest-tunnel"
            variant="outlined"
            value={destination}
            onChange={(e) => setDest(e.target.value)}
          />
        </FormControl>
        <Button className={classes.addButton} onClick={addNew}>
          ????????????
        </Button>
      </div>
      <div className={classes.shellBox}>
        <TunnelTable deleteTunnel={deleteTunnel} tunnelList={tunnelList} editTunnel={editTunnel} hostList={hostList} />
      </div>
    </div>
  );
};

export default connect(mapStateToProps, mapDispatch)(TunnelPage);
