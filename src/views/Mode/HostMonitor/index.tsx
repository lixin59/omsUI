import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { GroupInfo, HostInfo, IState, TagInfo } from '../../../store/interface';

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import FormControl from '@material-ui/core/FormControl';
import OmsLabel from '../../../components/OmsLabel';
import OmsSelect from '../../../components/OmsSelect';
import OmsMenuItem from '../../../components/OmsSelect/OmsMenuItem';
import Button from '@material-ui/core/Button';
import LinkIcon from '@material-ui/icons/Link';
import Grid from '@material-ui/core/Grid';
// v5
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TabPanel from '../../../components/OmsTabs/TabPanel';
import { a11yProps } from '../../../utils/index';

import { useSnackbar } from 'notistack';
import { baseUrl, url } from '../../../api/websocket/url';
import GaugeChart from '../../../components/OmsEcharts/GaugeChart';
import LiquidfillChart from '../../../components/OmsEcharts/LiquidfillChart';
import PieChart from '../../../components/OmsEcharts/PieChart';
import RowBarChart from '../../../components/OmsEcharts/RowBarChart';
import { bytesToSize } from '../../../utils/calculate';
// import LinearProgressWithLabel from '../../../components/UploadFileProgress/Linear';
import hostSvg from '../../../assets/icons/hostmonitor.svg';
import LineProgress from '../../../components/LineProgress';
import OmsError from '../../../components/OmsError';

type tDP = {
  // deleteGroup: ActionCreator<any>;
  // addGroup: ActionCreator<any>;
  // editGroup: ActionCreator<any>;
  // deleteTag: ActionCreator<any>;
  // addTag: ActionCreator<any>;
  // editTag: ActionCreator<any>;
};

type tOP = any;

type tSP = tOP & {
  hostList: HostInfo[];
  groupList: GroupInfo[];
  tagList: TagInfo[];
};

const mapStateToProps = (state: IState, props: tOP): tSP => ({
  ...props,
  hostList: state.hostList,
  groupList: state.groupList,
  tagList: state.tagList
});
const mapDispatch: tDP = {
  // deleteGroup: actions.deleteGroupInfo,
  // addGroup: actions.addGroupInfo,
  // editGroup: actions.editGroupInfo,
  // deleteTag: actions.deleteTagInfo,
  // addTag: actions.addTagInfo,
  // editTag: actions.editTagInfo,
};

type tProps = tSP & tDP;

type tCpu = {
  guest: number; // ??????????????????????????????????????????????????????????????????????????????CPU??????
  idle: number; // ????????????????????????????????????I/O???????????????iowait???
  iowait: number; // ??????I/O???CPU??????
  irq: number; // ??????????????????CPU??????
  nice: number; // ?????????????????????CPU??????
  soft_irq: number; // ??????????????????CPU??????
  steal: number; // ?????????????????????????????????????????????????????????????????????CPU??????
  system: number; // ?????????CPU??????
  usage: number; // cpu?????????
  user: number; // ?????????CPU??????
};

type tFsInfo = {
  mount_point: string; // ?????????
  total: number; // ????????????
  free: number; // ??????????????????
  used: number; // ?????????????????????
};

interface IHostStatus {
  cpu: tCpu;
  fs_infos: tFsInfo[];
  hostname: string; // ?????????
  load_1: string; // 1??????????????????
  load_5: string; // 5??????????????????
  load_10: string; // 10??????????????????
  mem_buffers: number; // ???????????????
  mem_cached: number; // ???????????????
  mem_free: number; // ????????????
  mem_total: number; // ????????????
  mem_usage: number; // ???????????????
  swap_free: number; // ????????????????????????
  swap_total: number; // ????????????????????????
  swap_usage: number; // swap?????????
  running_procs: string | number; // ?????????????????????
  total_procs: string | number; // ????????????
  uptime: number; // ????????????
  start_up_time: string; // ????????????
}

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    root: {
      width: '98%',
      height: '100%'
    },
    ControlBox: {
      marginBottom: '20px',
      width: '100%',
      display: 'flex',
      alignContent: 'space-evenly',
      alignItems: 'center',
      justifyContent: 'flex-start'
    },
    Control: {
      width: '25%'
    },
    mkdir: {
      width: '400px'
    },
    LinkButton: {
      marginTop: '12px',
      marginLeft: '40px',
      height: '45px',
      width: '90px',
      backgroundColor: theme.palette.info[theme.palette.type],
      '&:hover': {
        backgroundColor: theme.palette.info.main
      }
    },
    dashBoard: {
      height: '85%'
    },
    box1: {
      height: '10%',
      display: 'flex',
      alignContent: 'space-evenly',
      alignItems: 'center',
      justifyContent: 'space-around'
    },
    box3: {
      overflowY: 'auto',
      height: '100%',
      width: '100%'
    },
    paper: {
      height: '100%',
      minHeight: '180px',
      width: '100%',
      borderRadius: '20px',
      boxShadow: '2px 4px 5px 1px rgb(0 0 0 / 14%)'
    },
    box1Content: {
      height: '100%',
      width: '25%'
    },
    gridCard: {
      height: '100%',
      minHeight: '180px',
      width: '100%',
      borderRadius: '20px',
      boxShadow: '2px 4px 5px 1px rgb(0 0 0 / 14%)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      alignContent: 'space-evenly'
    },
    box3Content: {
      height: '90%',
      width: '100%',
      marginTop: '10px',
      marginBottom: '10px'
    }
  });
});

const HostMonitorPage = ({ hostList }: tProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();
  const [hostId, setHost] = useState<number>(0);
  const [ws, setWs] = useState<'' | WebSocket>('');
  const [status, setStatus] = useState<null | IHostStatus>(null);
  const [isConnect, setIsConnect] = useState<boolean>(false);
  const [value, setValue] = React.useState(0);

  useEffect(() => {
    const webSocket = new WebSocket(`${baseUrl}${url.index}`);
    setWs(webSocket);
    webSocket.onopen = (evt) => {
      console.log('WebSocket??????????????????????????????????????????');
      // webSocket.send(JSON.stringify({ type: '"WS_CMD' }));
    };
    webSocket.onmessage = (evt) => {
      // console.log('????????????', evt);
      console.log(JSON.parse(evt.data));
      const data = JSON.parse(evt.data);
      // console.log(data);
      if (data.code !== '0') {
        enqueueSnackbar(` err: ${data.msg}`, {
          autoHideDuration: 2000,
          variant: 'error'
        });
        return;
      }
      setStatus(data.data);
    };
    webSocket.onerror = (evt) => {
      console.warn(evt);
      enqueueSnackbar(` WebSocket?????????????????????: ${evt.type}`, {
        autoHideDuration: 2000,
        variant: 'error'
      });
    };
    webSocket.onclose = function (evt) {
      console.log('Connection closed.', evt);
      // enqueueSnackbar(` WebSocket?????????????????? ??????????????????: ${evt.type}`, {
      //   autoHideDuration: 2000,
      //   variant: 'error'
      // });
    };
    return () => {
      webSocket.close();
    };
  }, []);

  const browseHostMonitor = () => {
    try {
      if (isConnect) {
        (ws as WebSocket).send(
          JSON.stringify({
            type: 'HOST_STATUS',
            event: 'cancel'
          })
        );
      }
      (ws as WebSocket).send(
        JSON.stringify({
          type: 'HOST_STATUS',
          event: 'connect',
          data: { type: 'host', id: hostId, interval: 2 }
        })
      );
      setIsConnect(true);
    } catch (e) {
      enqueueSnackbar(` err: ${e}`, {
        autoHideDuration: 4000,
        variant: 'error'
      });
    }
  };

  const switchTab = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <div className={classes.ControlBox}>
        <FormControl className={classes.Control}>
          <OmsLabel>???????????????</OmsLabel>
          <OmsSelect
            labelId="typeItem-select-label-host"
            id="typeItem-select-label-host"
            value={hostId || ''}
            onChange={(e) => setHost(e?.target?.value as number)}>
            {hostList.map((e) => {
              return (
                <OmsMenuItem key={e.name} value={e.id}>
                  {e.name}
                </OmsMenuItem>
              );
            })}
          </OmsSelect>
        </FormControl>
        <Button disabled={!hostId} className={classes.LinkButton} startIcon={<LinkIcon />} onClick={browseHostMonitor}>
          ??????
        </Button>
      </div>
      {status ? (
        <Paper className={classes.dashBoard} elevation={2}>
          <div className={classes.box1}>
            <Typography variant="h5" gutterBottom>
              {`????????????${status?.hostname || ''}`}
            </Typography>
            <Typography variant="h5" gutterBottom>
              {`???????????????${status?.start_up_time || ''}`}
            </Typography>
          </div>
          <Divider />
          <div style={{ height: '90%' }}>
            <Tabs style={{ height: '10%' }} value={value} onChange={switchTab} aria-label="basic tabs example">
              <Tab label="????????????" {...a11yProps(0)} />
              <Tab label="????????????" {...a11yProps(1)} />
            </Tabs>
            <TabPanel style={{ height: '90%', overflow: 'auto' }} value={value} index={0}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Paper className={classes.gridCard}>
                    <div style={{ height: '100%', width: '65%' }}>
                      <GaugeChart data={status?.cpu.usage} title="cpu?????????" />
                    </div>
                    <div style={{ height: '100%', width: '35%', paddingTop: '10%' }}>
                      <Typography variant="body2" gutterBottom>
                        {`1??????????????????: ${status?.load_1 || ''}`}
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        {`5??????????????????: ${status?.load_5 || ''}`}
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        {`10??????????????????: ${status?.load_10 || ''}`}
                      </Typography>
                    </div>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Paper className={classes.gridCard}>
                    <div style={{ height: '100%', width: '65%' }}>
                      <LiquidfillChart data={Math.round(status?.mem_usage || 0) / 100} title="????????????" />
                    </div>
                    <div style={{ height: '100%', width: '35%', paddingTop: '10%' }}>
                      <Typography variant="body2" gutterBottom>
                        {`?????????: ${bytesToSize(status?.mem_total || 0)}`}
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        {`?????????: ${bytesToSize(status!.mem_total - status!.mem_free || 0)}`}
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        {`?????????: ${bytesToSize(status?.mem_free || 0)}`}
                      </Typography>
                    </div>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Paper className={classes.gridCard}>
                    <div style={{ height: '100%', width: '65%' }}>
                      <PieChart
                        dataList={[
                          { value: status?.swap_free || 0, name: 'swap_free' },
                          { value: status?.swap_usage || 0, name: 'swap_usage' }
                        ]}
                        title="Swap"
                      />
                    </div>
                    <div style={{ height: '100%', width: '35%', paddingTop: '10%' }}>
                      <Typography variant="body2" gutterBottom>
                        {`swap_total: ${bytesToSize(status?.swap_total || 0)}`}
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        {`swap_free: ${bytesToSize(status?.swap_free || 0)}`}
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        {`swap_usage: ${bytesToSize(status?.swap_usage || 0)}`}
                      </Typography>
                    </div>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Paper className={classes.gridCard}>
                    <div style={{ height: '100%', width: '100%', padding: '10px' }}>
                      <RowBarChart
                        data={[
                          { value: status?.total_procs || 0, name: '????????????' },
                          { value: status?.running_procs || 0, name: '??????????????????' }
                        ]}
                        title="??????"
                      />
                    </div>
                  </Paper>
                </Grid>
              </Grid>
            </TabPanel>
            <TabPanel style={{ height: '90%' }} value={value} index={1}>
              <div className={classes.box3}>
                {status &&
                  status.fs_infos.map((e) => (
                    <LineProgress
                      key={e.mount_point}
                      value={Math.round((e.used / (e.free + e.used)) * 100)}
                      desc={[
                        `???????????????: ${e.mount_point}`,
                        `?????????: ${bytesToSize(e.free)}`,
                        `?????????: ${bytesToSize(e.used)}`,
                        `???: ${bytesToSize(e.free + e.used)}`
                      ]}
                    />
                  ))}
              </div>
            </TabPanel>
          </div>
        </Paper>
      ) : (
        <OmsError
          errInfo="?????????????????????????????????"
          errType="network"
          imgStyle={{ width: '200px', height: '200px', marginTop: '20px' }}
          variant="h4"
          svgImg={hostSvg}
        />
      )}
    </div>
  );
};

export default connect(mapStateToProps, mapDispatch)(HostMonitorPage);
