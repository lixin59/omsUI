import React, { useEffect, useState, useRef, useReducer } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import SendIcon from '@material-ui/icons/Send';
import ClearIcon from '@material-ui/icons/Clear';
import FormControl from '@material-ui/core/FormControl';
import OmsSelect from '../../components/OmsSelect';
import { ActionCreator } from 'redux';
import { GroupInfo, HostInfo, IState, PlayerInfo, TagInfo } from '../../store/interface';
import { connect } from 'react-redux';
import OmsLabel from '../../components/OmsLabel';
import OmsMenuItem from '../../components/OmsSelect/OmsMenuItem';
import { useSnackbar } from 'notistack';
import { baseUrl, url } from '../../api/websocket/url';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { WebLinksAddon } from 'xterm-addon-web-links';
import { ANSI_COLOR_CYAN, ANSI_COLOR_RESET, ANSI_COLOR_YELLOW } from '../../components/OmsTerminal/constant';
import actions from '../../store/action';

type tDP = {
  updateGroupList: ActionCreator<any>;
  updateTagList: ActionCreator<any>;
  updateHostList: ActionCreator<any>;
  updatePlayerList: ActionCreator<any>;
};

// eslint-disable-next-line @typescript-eslint/ban-types
type tOP = {};

type tSP = tOP & {
  hostList: HostInfo[];
  groupList: GroupInfo[];
  tagList: TagInfo[];
  playerList: PlayerInfo[];
};

const mapStateToProps = (state: IState, props: tOP): tSP => ({
  ...props,
  hostList: state.hostList,
  groupList: state.groupList,
  tagList: state.tagList,
  playerList: state.playerList
});
const mapDispatch: tDP = {
  updateGroupList: actions.updateGroupList,
  updateTagList: actions.updateTagList,
  updateHostList: actions.getHostList,
  updatePlayerList: actions.initPlayerInfo
};

type tProps = tSP & tDP;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '98%',
      height: '100%'
    },
    ControlBox: {
      marginBottom: '20px',
      width: '100%',
      display: 'flex',
      alignContent: 'center',
      alignItems: 'flex-end',
      justifyContent: 'space-between'
    },
    Control: {
      width: '20%'
    },
    shellBox: {
      marginTop: '20px',
      // padding: '20px',
      width: '100%',
      height: '90%',
      overflow: 'auto'
      // backgroundColor: '#000000'
    }
  })
);

type tItem = 'hostList' | 'groupList' | 'tagList' | 'default';

const itemType = {
  hostList: '请选择主机',
  groupList: '请选择分组',
  tagList: '请选择标签',
  default: '请先选择类型'
};

interface WSdata {
  host_id: number;
  hostname: string;
  msg: string;
  status: boolean;
}

function init() {
  return [
    {
      host_id: 0,
      hostname: '',
      msg: '',
      status: false
    }
  ];
}

function reducer(state: WSdata[], action: any) {
  switch (action.type) {
    case 'add':
      return [...state, action.payload];
    case 'reset':
      return init();
    default:
      throw new Error();
  }
}

const Command = (props: tProps) => {
  const { hostList, groupList, tagList, playerList, updateHostList, updateTagList, updateGroupList, updatePlayerList } =
    props;
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();
  const [type, setType] = useState<string>('');
  const [id, setId] = useState<string>('');
  const [cmd, setCmd] = useState<string>('');
  const [cmdType, setCmdType] = useState<'cmd' | 'player'>('cmd');
  const [playerId, setPlayerId] = useState<number>(0);
  const [ws, setWs] = useState<'' | WebSocket>('');
  const [terminal, setTerminal] = useState<null | Terminal>(null);

  // const [msgList, dispatch] = useReducer(reducer, init(), init);

  // const msgRef = useRef<any>(null);

  // useEffect(() => {
  //   const div = msgRef.current as HTMLDivElement;
  //   div.scrollTop = div.scrollHeight;
  // }, [msgList]);

  useEffect(() => {
    updateHostList();
    updateTagList();
    updateGroupList();
    updatePlayerList();
  }, []);

  useEffect(() => {
    const webSocket = new WebSocket(`${baseUrl}${url.index}`);
    setWs(webSocket);

    // webSocket.onopen = (evt) => {
    //   console.log('WebSocket服务器连接成功执行命令');
    //   // webSocket.send(JSON.stringify({ type: '"WS_CMD' }));
    // };
    webSocket.onmessage = (evt) => {
      // console.log('收到消息');
      // console.log(JSON.parse(evt.data));
      const { data, type, msg } = JSON.parse(evt.data);
      if (type === 'msg') {
        terminal?.writeln(`${ANSI_COLOR_CYAN}${msg}${ANSI_COLOR_RESET}`);
      } else {
        terminal?.writeln(`${ANSI_COLOR_YELLOW}(${data?.seq} ${data?.hostname} ${data?.addr})${ANSI_COLOR_RESET}`);
        terminal?.writeln(data.msg);
      }
      // dispatch({ type: 'add', payload: data });
    };
    webSocket.onerror = (evt) => {
      enqueueSnackbar(` WebSocket服务器连接失败: ${evt.type}`, {
        autoHideDuration: 2000,
        variant: 'error'
      });
    };
    // webSocket.onclose = function (evt) {
    //   // enqueueSnackbar(` WebSocket连接已关闭 执行命令: ${evt.type}`, {
    //   //   autoHideDuration: 2000,
    //   //   variant: 'error'
    //   // });
    // };
    return () => {
      webSocket.close();
    };
  }, [terminal]);

  useEffect(() => {
    const term = new Terminal({ rows: 30, cols: 120 });
    const fitAddon = new FitAddon();
    term.loadAddon(new WebLinksAddon());
    term.loadAddon(fitAddon);
    setTerminal(term);
    // term.focus();
    // fitAddon.fit();

    const timer = setTimeout(() => {
      fitAddon.fit();
      term.open(document.getElementById('commandTerminal') as HTMLElement);
    }, 100);

    // term.onResize((event) => {
    //   if (timers) {
    //     //  防抖 只发送最后一次resize的值
    //     clearTimeout(timers);
    //     timers = null;
    //   }
    //   if (!timers) {
    //     timers = setTimeout(function () {
    //       // console.log(event);
    //       ws.send(JSON.stringify({ cols: event.cols, rows: event.rows }));
    //       timers = null;
    //     }, 500);
    //   }
    // });
    const termResize = () => {
      fitAddon.fit();
    };
    window.addEventListener('resize', termResize);

    return () => {
      clearTimeout(timer);
      term.dispose();
      window.removeEventListener('resize', termResize);
    };
  }, []);

  const sendCommand = () => {
    (ws as WebSocket).send(
      JSON.stringify({ type: 'WS_CMD', data: { type, id, cmd, cmd_type: cmdType, cmd_id: playerId }})
    );
  };

  const selectType = (flag: boolean): string | Array<any> => {
    if (type === 'host') {
      return flag ? hostList : 'hostList';
    }
    if (type === 'group') {
      return flag ? groupList : 'groupList';
    }
    if (type === 'tag') {
      return flag ? tagList : 'tagList';
    }
    return flag ? [] : 'default';
  };

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setId(event.target.value as string);
  };

  return (
    <div className={classes.root}>
      <div className={classes.ControlBox}>
        <FormControl className={classes.Control} style={{ width: '120px' }}>
          <OmsLabel>请选择类型</OmsLabel>
          <OmsSelect id="type-select" value={type} onChange={(e) => setType(e.target.value as string)}>
            <OmsMenuItem value={'host'}>主机</OmsMenuItem>
            <OmsMenuItem value={'group'}>组</OmsMenuItem>
            <OmsMenuItem value={'tag'}>标签</OmsMenuItem>
          </OmsSelect>
        </FormControl>
        <FormControl className={classes.Control}>
          <OmsLabel>{itemType[selectType(false) as tItem]}</OmsLabel>
          <OmsSelect
            disabled={!type}
            labelId="typeItem-select-label"
            id="typeItem-select-label"
            value={id}
            onChange={handleChange}>
            {selectType(true).length > 0
              ? (selectType(true) as Array<any>).map((e) => (
                <OmsMenuItem key={e.name} value={e.id}>
                  {`${e.name} ${e?.addr ? e.addr : ''}`}
                </OmsMenuItem>
              ))
              : null}
          </OmsSelect>
        </FormControl>
        <FormControl className={classes.Control} style={{ width: '100px' }}>
          <OmsLabel>命令类型</OmsLabel>
          <OmsSelect
            id="type-select-cmd-type"
            value={cmdType}
            onChange={(e) => setCmdType(e.target.value as 'cmd' | 'player')}>
            <OmsMenuItem value={'cmd'}>cmd</OmsMenuItem>
            <OmsMenuItem value={'player'}>剧本</OmsMenuItem>
          </OmsSelect>
        </FormControl>
        {cmdType === 'cmd' ? (
          <TextField
            style={{ marginTop: '12px', width: '400px' }}
            className={classes.Control}
            size="small"
            id="cmd-disabled"
            label="请输入执行的命令"
            variant="outlined"
            value={cmd}
            onChange={(e) => setCmd(e.target.value)}
          />
        ) : (
          <FormControl className={classes.Control}>
            <OmsLabel>选择剧本</OmsLabel>
            <OmsSelect
              id="type-select-player-id"
              value={playerId}
              onChange={(e) => setPlayerId(e.target.value as number)}>
              {playerList?.map((p) => (
                <OmsMenuItem key={p.id} value={p.id}>
                  {p.name}
                </OmsMenuItem>
              ))}
            </OmsSelect>
          </FormControl>
        )}
        <div>
          <Tooltip title="下发命令" placement="top-start">
            <IconButton
              color="primary"
              disabled={!(!!type && !!id && (!!cmd || !!playerId))}
              aria-label="send"
              onClick={sendCommand}>
              <SendIcon fontSize="large" />
            </IconButton>
          </Tooltip>
          <Tooltip title="清屏" placement="top-start">
            <IconButton
              aria-label="clear"
              onClick={() => {
                terminal?.clear();
              }}>
              <ClearIcon fontSize="large" color="error" />
            </IconButton>
          </Tooltip>
        </div>
      </div>
      <div className={classes.shellBox}>
        <div id="commandTerminal" />
      </div>
    </div>
  );
};

export default connect(mapStateToProps, mapDispatch)(Command);
