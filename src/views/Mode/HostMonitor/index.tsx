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
import { ActionCreator } from 'redux';
import actions from '../../../store/action';

type tDP = {
  updateHostList: ActionCreator<any>;
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
  updateHostList: actions.getHostList
};

type tProps = tSP & tDP;

type tCpu = {
  guest: number; // 通过虚拟化运行其他操作系统的时间，也就是运行虚拟机的CPU时间
  idle: number; // 空闲时间。注意，它不包括I/O等待时间（iowait）
  iowait: number; // 等待I/O的CPU时间
  irq: number; // 处理硬中断的CPU时间
  nice: number; // 低优先级用户态CPU时间
  soft_irq: number; // 处理软中断的CPU时间
  steal: number; // 当系统运行在虚拟机中的时候，被其他虚拟机占用的CPU时间
  system: number; // 内核态CPU时间
  usage: number; // cpu使用率
  user: number; // 用户态CPU时间
};

type tFsInfo = {
  mount_point: string; // 挂载点
  total: number; // 磁盘总量
  free: number; // 磁盘剩余空间
  used: number; // 磁盘已使用空间
};

interface IHostStatus {
  cpu: tCpu;
  fs_infos: tFsInfo[];
  hostname: string; // 主机名
  load_1: string; // 1分钟平均负载
  load_5: string; // 5分钟平均负载
  load_10: string; // 10分钟平均负载
  mem_buffers: number; // 内存缓冲数
  mem_cached: number; // 已缓存内存
  mem_free: number; // 内存余量
  mem_total: number; // 内存总量
  mem_usage: number; // 内存使用率
  swap_free: number; // 磁盘交换空间余量
  swap_total: number; // 磁盘交换空间总量
  swap_usage: number; // swap使用率
  running_procs: string | number; // 运行的进程数量
  total_procs: string | number; // 总进程数
  uptime: number; // 运行时间
  start_up_time: string; // 运行时间
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

const HostMonitorPage = ({ hostList, updateHostList }: tProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();
  const [hostId, setHost] = useState<number>(0);
  const [ws, setWs] = useState<'' | WebSocket>('');
  const [status, setStatus] = useState<null | IHostStatus>(null);
  const [isConnect, setIsConnect] = useState<boolean>(false);
  const [value, setValue] = React.useState(0);

  useEffect(() => {
    updateHostList();
  }, []);

  useEffect(() => {
    const webSocket = new WebSocket(`${baseUrl}${url.index}`);
    setWs(webSocket);
    webSocket.onopen = (evt) => {
      console.log('WebSocket服务器连接成功：主机监控页面');
      // webSocket.send(JSON.stringify({ type: '"WS_CMD' }));
    };
    webSocket.onmessage = (evt) => {
      // console.log('收到消息', evt);
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
      enqueueSnackbar(` WebSocket服务器连接失败: ${evt.type}`, {
        autoHideDuration: 2000,
        variant: 'error'
      });
    };
    webSocket.onclose = function (evt) {
      console.log('Connection closed.', evt);
      // enqueueSnackbar(` WebSocket连接已关闭： 主机监控页面: ${evt.type}`, {
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
          <OmsLabel>请选择主机</OmsLabel>
          <OmsSelect
            labelId="typeItem-select-label-host"
            id="typeItem-select-label-host"
            value={hostId || ''}
            onChange={(e) => setHost(e?.target?.value as number)}>
            {hostList.map((e) => {
              return (
                <OmsMenuItem key={e.name} value={e.id}>
                  {`${e.name}: ${e.addr}`}
                </OmsMenuItem>
              );
            })}
          </OmsSelect>
        </FormControl>
        <Button disabled={!hostId} className={classes.LinkButton} startIcon={<LinkIcon />} onClick={browseHostMonitor}>
          查看
        </Button>
      </div>
      {status ? (
        <Paper className={classes.dashBoard} elevation={2}>
          <div className={classes.box1}>
            <Typography variant="h5" gutterBottom>
              {`主机名：${status?.hostname || ''}`}
            </Typography>
            <Typography variant="h5" gutterBottom>
              {`运行时间：${status?.start_up_time || ''}`}
            </Typography>
          </div>
          <Divider />
          <div style={{ height: '90%' }}>
            <Tabs style={{ height: '10%' }} value={value} onChange={switchTab} aria-label="basic tabs example">
              <Tab label="系统资源" {...a11yProps(0)} />
              <Tab label="文件系统" {...a11yProps(1)} />
            </Tabs>
            <TabPanel style={{ height: '90%', overflow: 'auto' }} value={value} index={0}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Paper className={classes.gridCard}>
                    <div style={{ height: '100%', width: '65%' }}>
                      <GaugeChart data={status?.cpu.usage} title="cpu使用率" />
                    </div>
                    <div style={{ height: '100%', width: '35%', paddingTop: '10%' }}>
                      <Typography variant="body2" gutterBottom>
                        {`1分钟平均负载: ${status?.load_1 || ''}`}
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        {`5分钟平均负载: ${status?.load_5 || ''}`}
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        {`10分钟平均负载: ${status?.load_10 || ''}`}
                      </Typography>
                    </div>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Paper className={classes.gridCard}>
                    <div style={{ height: '100%', width: '65%' }}>
                      <LiquidfillChart data={Math.round(status?.mem_usage || 0) / 100} title="内存使用" />
                    </div>
                    <div style={{ height: '100%', width: '35%', paddingTop: '10%' }}>
                      <Typography variant="body2" gutterBottom>
                        {`总大小: ${bytesToSize(status?.mem_total || 0)}`}
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        {`已使用: ${bytesToSize(status!.mem_total - status!.mem_free || 0)}`}
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        {`可使用: ${bytesToSize(status?.mem_free || 0)}`}
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
                          { value: status?.total_procs || 0, name: '总任务数' },
                          { value: status?.running_procs || 0, name: '运行中任务数' }
                        ]}
                        title="任务"
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
                        `磁盘挂载点: ${e.mount_point}`,
                        `可使用: ${bytesToSize(e.free)}`,
                        `已使用: ${bytesToSize(e.used)}`,
                        `共: ${bytesToSize(e.free + e.used)}`
                      ]}
                    />
                  ))}
              </div>
            </TabPanel>
          </div>
        </Paper>
      ) : (
        <OmsError
          errInfo="请选择一个主机进行连接"
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
