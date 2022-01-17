import React, { useState, useCallback, useEffect } from 'react';
import { connect } from 'react-redux';
import { GroupInfo, HostInfo, IState, TagInfo } from '../../../store/interface';

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import OmsLabel from '../../../components/OmsLabel';
import OmsSelect from '../../../components/OmsSelect';
import OmsMenuItem from '../../../components/OmsSelect/OmsMenuItem';
import Button from '@material-ui/core/Button';
import LinkIcon from '@material-ui/icons/Link';

import { useSnackbar } from 'notistack';
import { baseUrl, url } from '../../../api/websocket/url';
import GaugeChart from '../../../components/OmsEcharts/GaugeChart';


type tDP = {
  // deleteGroup: ActionCreator<any>;
  // addGroup: ActionCreator<any>;
  // editGroup: ActionCreator<any>;
  // deleteTag: ActionCreator<any>;
  // addTag: ActionCreator<any>;
  // editTag: ActionCreator<any>;
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
  // deleteGroup: actions.deleteGroupInfo,
  // addGroup: actions.addGroupInfo,
  // editGroup: actions.editGroupInfo,
  // deleteTag: actions.deleteTagInfo,
  // addTag: actions.addTagInfo,
  // editTag: actions.editTagInfo,
};

type tProps = tSP & tDP;

type tCpu = {
  guest: number, // 通过虚拟化运行其他操作系统的时间，也就是运行虚拟机的CPU时间
  idle: number, // 空闲时间。注意，它不包括I/O等待时间（iowait）
  iowait: number, // 等待I/O的CPU时间
  irq: number, // 处理硬中断的CPU时间
  nice: number, // 低优先级用户态CPU时间
  soft_irq: number, // 处理软中断的CPU时间
  steal: number, // 当系统运行在虚拟机中的时候，被其他虚拟机占用的CPU时间
  system: number, // 内核态CPU时间
  usage: number, // cpu使用率
  user: number, // 用户态CPU时间
}

type tFsInfo = {
  free: number, // 磁盘剩余空间
  mount_point: string, // 挂载点
  used: string, // 磁盘已使用空间
}

interface IHostStatus {
  cpu: tCpu,
  fs_infos: tFsInfo[],
  hostname: string, // 主机名
  load_1: string, // 1分钟平均负载
  load_5: string, // 5分钟平均负载
  load_10: string, // 10分钟平均负载
  mem_buffers: number, // 内存缓冲数
  mem_cached: number, // 已缓存内存
  mem_free: number, // 内存余量
  mem_total: number, // 内存总量
  running_procs: string, // 运行的进程数量
  swap_free: number, // 磁盘交换空间余量
  swap_total: number, // 磁盘交换空间总量
  total_procs: string, // 总进程数
  uptime: number, // 运行时间
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
      height: '85%',
      backgroundColor: '#000'
    },
    box1: {
      height: '30%',
      backgroundColor: '#fff',
      display: 'flex',
      alignContent: 'space-evenly',
      alignItems: 'center',
      justifyContent: 'space-around'
    },
    box1Content: {
      height: '100%',
      width: '25%'
    }
  });
}
);

const HostMonitorPage = ({ hostList }: tProps) => {


  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();
  const [hostId, setHost] = useState<number>(0);
  const [ws, setWs] = useState<'' | WebSocket>('');
  const [status, setStatus] = useState<null | IHostStatus>(null);
  useEffect(() => {
    const webSocket = new WebSocket(`${baseUrl}${url.index}`);
    setWs(webSocket);
    webSocket.onopen = (evt) => {
      console.log('WebSocket服务器连接成功执行命令');
      // webSocket.send(JSON.stringify({ type: '"WS_CMD' }));
    };
    webSocket.onmessage = (evt) => {
      // console.log('收到消息');
      // console.log(JSON.parse(evt.data));
      const { data } = JSON.parse(evt.data);
      setStatus(data);
      console.log(data);
    };
    webSocket.onerror = (evt) => {
      console.warn(evt);
      enqueueSnackbar(` WebSocket服务器连接失败: ${evt.type}`, {
        autoHideDuration: 2000,
        variant: 'error'
      });
    };
    webSocket.onclose = function(evt) {
      console.log('Connection closed.', evt);
      enqueueSnackbar(` WebSocket连接已关闭 执行命令: ${evt.type}`, {
        autoHideDuration: 2000,
        variant: 'error'
      });
    };
    return () => {
      webSocket.close();
    };
  }, []);

  const browseHostMonitor = () => {
    console.log(hostId);
    (ws as WebSocket).send(JSON.stringify({ type: 'HOST_STATUS', data: { type: 'host', id: hostId }}));
  };

  return (
    <div className={classes.root}>
      <div className={classes.ControlBox}>
        <FormControl className={classes.Control}>
          <OmsLabel>请选择主机</OmsLabel>
          <OmsSelect
            labelId='typeItem-select-label-host'
            id='typeItem-select-label-host'
            value={hostId || ''}
            onChange={(e) => setHost(e?.target?.value as number)}
          >
            {hostList.map((e) => {
              return (<OmsMenuItem key={e.name} value={e.id}>{e.name}</OmsMenuItem>);
            })}
          </OmsSelect>
        </FormControl>
        <Button
          disabled={!hostId}
          className={classes.LinkButton}
          startIcon={<LinkIcon />}
          onClick={browseHostMonitor}
        >
          查看
        </Button>
      </div>
      <div className={classes.dashBoard}>
        <div className={classes.box1}>
          <div className={classes.box1Content}>
            cpu使用率
            <GaugeChart data={status?.cpu.usage}/>
          </div>
          <div className={classes.box1Content}>
            内存使用率
            <GaugeChart data={Math.round(Number(status?.mem_total - status?.mem_free) / Number(status?.mem_total))}/>
          </div>
          <div className={classes.box1Content}>
            swap使用率
            <GaugeChart data={Math.round(Number(status?.swap_total - status?.swap_free) / Number(status?.swap_total))}/>
          </div>
          <div className={classes.box1Content}>
            进程数量
            <div>{status?.running_procs || 0}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default connect(
  mapStateToProps,
  mapDispatch
)(HostMonitorPage);

