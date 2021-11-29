import React, { useEffect, useState, useRef, useReducer } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import SendIcon from '@material-ui/icons/Send';
import ClearIcon from '@material-ui/icons/Clear';
import FormControl from '@material-ui/core/FormControl';
import OmsSelect from '../../components/OmsSelect';
// import { ActionCreator } from 'redux';
import { GroupInfo, HostInfo, IState, TagInfo } from '../../store/interface';
import { connect } from 'react-redux';
import OmsLabel from '../../components/OmsLabel';
import OmsMenuItem from '../../components/OmsSelect/OmsMenuItem';
import { useSnackbar } from 'notistack';
import { baseUrl, url } from '../../api/websocket/url';
import TextField from '@material-ui/core/TextField';

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
      alignContent: 'space-evenly',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    Control: {
      width: '20%'
    },
    sendButton: {
      marginTop: '12px',
      height: '45px',
      width: '140px',
      backgroundColor: theme.palette.success[theme.palette.type],
      '&:hover': {
        backgroundColor: theme.palette.success.main
      }
    },
    clearButton: {
      marginTop: '12px',
      height: '45px',
      width: '80px',
      backgroundColor: theme.palette.error[theme.palette.type],
      '&:hover': {
        backgroundColor: theme.palette.error.main
      }
    },
    shellBox: {
      marginTop: '20px',
      padding: '20px',
      width: '100%',
      height: '70%',
      overflow: 'auto',
      backgroundColor: '#000000'
    },
    hostname: {
      width: '100%',
      color: '#fce700',
      whiteSpace: 'pre-line',
      wordWrap: 'break-word',
      wordBreak: 'break-all'
    },
    shellMsg: {
      width: '100%',
      color: '#fff',
      marginBottom: '20px',
      whiteSpace: 'pre-line',
      wordWrap: 'break-word',
      wordBreak: 'break-all'
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
  host_id: number
  hostname: string,
  msg: string,
  status: boolean
}

function init() {
  return [{
    host_id: 0,
    hostname: '',
    msg: '',
    status: false
  }];
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

const Command = ({ hostList, groupList, tagList }: tProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();
  const [type, setType] = useState<string>('');
  const [id, setId] = useState<string>('');
  const [cmd, setCmd] = useState<string>('');
  const [ws, setWs] = useState<'' | WebSocket>('');

  const [msgList, dispatch] = useReducer(reducer, init(), init);

  const msgRef = useRef<any>(null);

  useEffect(() => {
    const div = msgRef.current as HTMLDivElement;
    div.scrollTop = div.scrollHeight;
  }, [msgList]);

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
      dispatch({ type: 'add', payload: data });
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

  const sendCommand = () => {
    (ws as WebSocket).send(JSON.stringify({ type: 'WS_CMD', data: { type, id, cmd }}));
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
        <FormControl className={classes.Control}>
          <OmsLabel>请选择类型</OmsLabel>
          <OmsSelect
            id='type-select'
            value={type}
            onChange={(e) => setType(e.target.value as string)}
          >
            <OmsMenuItem value={'host'}>主机</OmsMenuItem>
            <OmsMenuItem value={'group'}>组</OmsMenuItem>
            <OmsMenuItem value={'tag'}>标签</OmsMenuItem>
          </OmsSelect>
        </FormControl>
        <FormControl className={classes.Control}>
          <OmsLabel>{itemType[(selectType(false) as tItem)]}</OmsLabel>
          <OmsSelect
            disabled={!type}
            labelId='typeItem-select-label'
            id='typeItem-select-label'
            value={id}
            onChange={handleChange}
          >
            {selectType(true).length > 0 ? (selectType(true) as Array<any>).map((e) => {
              return (<OmsMenuItem key={e.name} value={e.id}>{e.name}</OmsMenuItem>);
            }) : null }
          </OmsSelect>
        </FormControl>
        <TextField
          style={{ marginTop: '12px' }}
          className={classes.Control}
          size='small'
          id='cmd-disabled'
          label='请输入执行的命令'
          variant='outlined'
          value={cmd}
          onChange={(e) => setCmd(e.target.value)}
        />
        <Button
          disabled={!(!!type && !!id && !!cmd)}
          className={classes.sendButton}
          startIcon={<SendIcon />}
          onClick={sendCommand}
        >
        下发命令
        </Button>
        <Button
          className={classes.clearButton}
          startIcon={<ClearIcon />}
          onClick={() => { dispatch({ type: 'reset' }); }}
        >
          清屏
        </Button>
      </div>
      <div ref={msgRef} className={classes.shellBox}>
        {msgList.length > 0 ? msgList.map((e: WSdata) => (
          <>
            <div key={new Date().getTime() + 1} className={classes.hostname}>
              {e.hostname}
            </div>
            <div key={new Date().getTime() - 1} className={classes.shellMsg}>
              {e.msg}
            </div>
          </>
        )) : null}
      </div>
    </div>
  );
};

export default connect(
  mapStateToProps,
  mapDispatch
)(Command);
