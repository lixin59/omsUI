import React, { useEffect, useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import SendIcon from '@material-ui/icons/Send';
import ClearIcon from '@material-ui/icons/Clear';
import FormControl from '@material-ui/core/FormControl';
import OmsSelect from '../../components/OmsSelect';
import { ActionCreator } from 'redux';
import { GroupInfo, HostInfo, IState, PlayerInfo, QuickCommandInfo, TagInfo } from '../../store/interface';
import { connect } from 'react-redux';
import OmsLabel from '../../components/OmsLabel';
import OmsMenuItem from '../../components/OmsSelect/OmsMenuItem';
import { useSnackbar } from 'notistack';
import { baseUrl, url } from '../../api/websocket/url';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { WebLinksAddon } from 'xterm-addon-web-links';
import { ANSI_COLOR_CYAN, ANSI_COLOR_RESET, ANSI_COLOR_YELLOW } from '../../components/OmsTerminal/constant';
import actions from '../../store/action';
import { debounce } from 'lodash';
import { getCMDListApi } from '../../api/http/command';
import useDebounce from '../../hooks/debounce';

type tDP = {
  updateGroupList: ActionCreator<any>;
  updateTagList: ActionCreator<any>;
  updateHostList: ActionCreator<any>;
  updatePlayerList: ActionCreator<any>;
  initQuickCommandAction: ActionCreator<any>;
};

// eslint-disable-next-line @typescript-eslint/ban-types
type tOP = {};

type tSP = tOP & {
  hostList: HostInfo[];
  groupList: GroupInfo[];
  tagList: TagInfo[];
  playerList: PlayerInfo[];
  quickCommandList: QuickCommandInfo[];
};

const mapStateToProps = (state: IState, props: tOP): tSP => ({
  ...props,
  hostList: state.hostList,
  groupList: state.groupList,
  tagList: state.tagList,
  playerList: state.playerList,
  quickCommandList: state.quickCommandList
});
const mapDispatch: tDP = {
  updateGroupList: actions.updateGroupList,
  updateTagList: actions.updateTagList,
  updateHostList: actions.getHostList,
  updatePlayerList: actions.initPlayerInfo,
  initQuickCommandAction: actions.initQuickCommandList
};

type tProps = tSP & tDP;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '98%',
      height: '100%'
    },
    ControlBox: {
      // marginBottom: '20px',
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
      // height: '90%',
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

let terminalSize = { rows: 30, cols: 120 };

const Command = (props: tProps) => {
  const {
    hostList,
    groupList,
    tagList,
    playerList,
    updateHostList,
    updateTagList,
    updateGroupList,
    updatePlayerList,
    initQuickCommandAction,
    quickCommandList
  } = props;
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();
  const [type, setType] = useState<string>('');
  const [id, setId] = useState<string>('');
  const [cmd, setCmd] = useState<string>('');
  const [cmdList, setCmdList] = useState<string[]>([]);
  const [cmdType, setCmdType] = useState<'cmd' | 'player'>('cmd');
  const [playerId, setPlayerId] = useState<number>(0);
  const [ws, setWs] = useState<null | WebSocket>(null);
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
    initQuickCommandAction();
  }, []);

  const handleDebounce = useDebounce((value) => {
    console.log(value);
    const getData = async () => {
      console.log('cmd', value);
      const res = await getCMDListApi(value);
      if (res?.data?.length > 0) {
        setCmdList(res.data);
      }
    };
    getData();
  }, 300);

  useEffect(() => {
    try {
      if (!cmd) {
        return;
      }
      handleDebounce(cmd);
    } catch (e) {
      enqueueSnackbar(`获取cmd历史数据失败: ${JSON.stringify(e)}`, {
        autoHideDuration: 2000,
        variant: 'error'
      });
    }
  }, [cmd]);

  useEffect(() => {
    const webSocket = new WebSocket(`${baseUrl}${url.index}`);
    const term = new Terminal({ ...terminalSize });
    const fitAddon = new FitAddon();
    term.loadAddon(new WebLinksAddon());
    term.loadAddon(fitAddon);
    setTerminal(term);
    setWs(webSocket);

    term.open(document.getElementById('commandTerminal') as HTMLElement);
    term.focus();
    fitAddon.fit();

    // 界面初始化告诉后端终端大小
    webSocket.onopen = (evt) => {
      // console.log('WebSocket服务器连接成功执行命令');
      webSocket.send(JSON.stringify({ type: 'RESIZE', data: terminalSize }));
    };
    webSocket.onmessage = (evt) => {
      // console.log('收到消息');
      // console.log(JSON.parse(evt.data));
      const { data, type, msg } = JSON.parse(evt.data);
      if (type === 'msg') {
        term?.writeln(`${ANSI_COLOR_CYAN}${msg}${ANSI_COLOR_RESET}`);
      } else {
        term?.writeln(`${ANSI_COLOR_YELLOW}(${data?.seq} ${data?.hostname} ${data?.addr})${ANSI_COLOR_RESET}`);
        term?.writeln(data.msg);
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

    const timer = setTimeout(() => {
      fitAddon.fit();
    }, 100);

    term.onResize((event) => {
      (ws as WebSocket)?.send(JSON.stringify({ type: 'RESIZE', data: { cols: event.cols, rows: event.rows }}));
      terminalSize = { cols: event.cols, rows: event.rows };
    });
    const termResize = debounce(() => {
      // todo 升级自适应终端大小插件的版本，解决插件没有自动设置rows的问题
      const rows = Math.ceil(document.body.clientHeight / 18 - 10);
      term.resize(terminalSize.cols, rows);
      fitAddon.fit();
    }, 300);
    window.addEventListener('resize', termResize);

    return () => {
      webSocket.close();
      clearTimeout(timer);
      term.dispose();
      window.removeEventListener('resize', termResize);
    };
  }, []);

  const sendCommand = () => {
    if (!type && !id && (!cmd || !playerId)) {
      enqueueSnackbar(`请先选择所有选项`, {
        autoHideDuration: 2000,
        variant: 'error'
      });
      return;
    }
    (ws as WebSocket).send(
      JSON.stringify({ type: 'WS_CMD', data: { type, id, cmd, cmd_type: cmdType, cmd_id: playerId }})
    );
  };

  const sendQuickCommand = (cmdObj: QuickCommandInfo) => {
    if (!type && !id && (!cmd || !playerId)) {
      enqueueSnackbar(`请先选择执行对象`, {
        autoHideDuration: 2000,
        variant: 'error'
      });
      return;
    }
    (ws as WebSocket).send(
      JSON.stringify({ type: 'WS_CMD', data: { type, id, cmd: cmdObj.cmd, cmd_type: 'cmd', cmd_id: playerId }})
    );
  };

  const selectType = (flag: boolean): string | Array<HostInfo | TagInfo | GroupInfo> => {
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
              ? (selectType(true) as Array<HostInfo | TagInfo | GroupInfo>).map((e) => (
                <OmsMenuItem key={e.name} value={e.id}>
                  {`${e.name} ${'addr' in e && e?.addr ? e.addr : ''}`}
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
          // <TextField
          //   style={{ marginTop: '12px', width: '400px' }}
          //   className={classes.Control}
          //   size="small"
          //   id="cmd-disabled"
          //   label="请输入执行的命令"
          //   variant="outlined"
          //   value={cmd}
          //   onChange={(e) => setCmd(e.target.value)}
          // />
          <Autocomplete
            freeSolo
            inputValue={cmd}
            onInputChange={(event, newInputValue: string) => {
              setCmd(newInputValue);
            }}
            id="cmd-disabled"
            options={cmdList}
            sx={{ width: 300 }}
            renderInput={(params) => <TextField {...params} size="small" label="请输入执行的命令" />}
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
            <IconButton color="primary" aria-label="send" onClick={sendCommand}>
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
      <div style={{ width: '100%' }}>
        {quickCommandList.map((e) => (
          <Tooltip key={e.id} title={`发送快捷命令: ${e.cmd}`} placement="top-start">
            <Button
              variant="outlined"
              size="small"
              style={{ padding: '0, 2px', height: '20px', textTransform: 'none' }}
              onClick={() => {
                sendQuickCommand(e);
              }}>
              {e.name}
            </Button>
          </Tooltip>
        ))}
      </div>
    </div>
  );
};

export default connect(mapStateToProps, mapDispatch)(Command);
