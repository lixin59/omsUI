import React, { useEffect, useState, useRef, useReducer } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import LinkIcon from '@material-ui/icons/Link';
import LinkOffIcon from '@material-ui/icons/LinkOff';
import FormControl from '@material-ui/core/FormControl';
import SendIcon from '@material-ui/icons/Send';
import OmsSelect from '../../components/OmsSelect';
import { ActionCreator } from 'redux';
import { HostInfo, IState, QuickCommandInfo } from '../../store/interface';
import OmsTerminal from '../../components/OmsTerminal';
import { connect } from 'react-redux';
import OmsLabel from '../../components/OmsLabel';
import OmsMenuItem from '../../components/OmsSelect/OmsMenuItem';
import OmsError from '../../components/OmsError';
import { useSnackbar } from 'notistack';
import { baseUrl } from '../../api/websocket/url';
import { useParams } from 'react-router-dom';
import actions from '../../store/action';
import ChromeTabs from '../../components/OmsTabs/ChromeTabs';
import ChromeTab from '../../components/OmsTabs/ChromeTab';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { a11yProps } from '../../utils';
import Tooltip from '@material-ui/core/Tooltip';
import AddIcon from '@material-ui/icons/Add';
import ChromeTabPanel from '../../components/OmsTabs/ChromeTabPanel';

type tDP = {
  updateHostList: ActionCreator<any>;
  initQuickCommandAction: ActionCreator<any>;
};

// eslint-disable-next-line @typescript-eslint/ban-types
type tOP = {};

type tSP = tOP & {
  hostList: HostInfo[];
  quickCommandList: QuickCommandInfo[];
};

const mapStateToProps = (state: IState, props: tOP): tSP => ({
  ...props,
  hostList: state.hostList,
  quickCommandList: state.quickCommandList
});
const mapDispatch: tDP = {
  updateHostList: actions.getHostList,
  initQuickCommandAction: actions.initQuickCommandList
};

type tProps = tSP & tDP;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
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
    LinkOffButton: {
      marginTop: '12px',
      marginLeft: '40px',
      height: '45px',
      width: '90px',
      marginRight: '40px',
      backgroundColor: theme.palette.error[theme.palette.type],
      '&:hover': {
        backgroundColor: theme.palette.error.main
      }
    },
    sendButton: {
      marginTop: '12px',
      marginLeft: '40px',
      height: '45px',
      width: '90px',
      marginRight: '40px',
      backgroundColor: theme.palette.success[theme.palette.type],
      '&:hover': {
        backgroundColor: theme.palette.success.main
      }
    },
    shellBox: {
      marginTop: '20px',
      width: '100%',
      height: '70%'
    }
  })
);

const WebSSH = ({ hostList, quickCommandList }: tSP) => {
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();
  const [item, setItem] = useState<number>(0);
  const [ws, setWs] = useState<'' | WebSocket>('');
  const [qCmd, setQcmd] = useState(0);

  const termId = useRef('terminal' + new Date().getTime());

  const params = useParams();

  useEffect(() => {
    // const id = Number(pathname.replace(/\/mode\/web_ssh\//g, ''));
    const id = Number(params?.id || '0');
    if (id !== 0) {
      connectHost(id);
      setItem(id);
    }
  }, []);

  const connectHost = (item: number) => {
    if (!item || ws) {
      // enqueueSnackbar(`请先选择一个主机`, {
      //   autoHideDuration: 3000,
      //   variant: 'error'
      // });
      return;
    }
    setWs(new WebSocket(`${baseUrl}ssh/${item}?cols=150&rows=40`));
  };

  const closeHost = () => {
    if (!ws) {
      return;
    }
    enqueueSnackbar('正在关闭WebSocket连接...', {
      autoHideDuration: 3000,
      variant: 'info'
    });
    ws?.send('exit' + '\r');
    setTimeout(() => {
      (ws as WebSocket).close();
      setWs('');
    }, 2000);
  };

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setItem(event.target.value as number);
    // console.log(type);
    // console.log(item);
  };

  return (
    <div className={classes.root}>
      <div className={classes.ControlBox}>
        <FormControl className={classes.Control}>
          <OmsLabel>请选择主机</OmsLabel>
          <OmsSelect
            labelId="typeItem-select-label"
            id="typeItem-select-label"
            value={item || ''}
            onChange={handleChange}>
            {hostList.map((e) => {
              return (
                <OmsMenuItem key={e.name} value={e.id}>
                  {`${e.name}: ${e.addr}`}
                </OmsMenuItem>
              );
            })}
          </OmsSelect>
        </FormControl>
        <Button
          disabled={!item || !!ws}
          className={classes.LinkButton}
          startIcon={<LinkIcon />}
          onClick={() => connectHost(item)}>
          连接
        </Button>
        <Button disabled={!ws} className={classes.LinkOffButton} startIcon={<LinkOffIcon />} onClick={closeHost}>
          断开
        </Button>
        <FormControl className={classes.Control}>
          <OmsLabel>请选择快捷命令</OmsLabel>
          <OmsSelect
            labelId="typeItem-select-cmd"
            id="typeItem-select-cmd"
            value={qCmd || ''}
            onChange={(event) => {
              setQcmd(event?.target?.value as number);
            }}>
            {quickCommandList.map((e) => {
              return (
                <OmsMenuItem key={e.id} value={e.id}>
                  {`${e.name}`}
                </OmsMenuItem>
              );
            })}
          </OmsSelect>
        </FormControl>
        <Button
          disabled={!ws}
          className={classes.sendButton}
          startIcon={<SendIcon />}
          onClick={() => {
            const cmdObj = quickCommandList.find((e) => e.id === qCmd);
            if (ws && cmdObj) {
              if (cmdObj.append_cr) {
                ws?.send(cmdObj.cmd + '\r');
                return;
              }
              ws?.send(cmdObj.cmd);
            }
          }}>
          发送
        </Button>
      </div>
      <div className={classes.shellBox}>
        {ws ? (
          <OmsTerminal id={termId.current} ws={ws as WebSocket} onCloseTodo={() => setWs('')} />
        ) : (
          <OmsError
            errInfo="请选择一个主机进行连接"
            errType="network"
            imgStyle={{ width: '400px', height: '400px' }}
            variant="h4"
          />
        )}
      </div>
    </div>
  );
};

const MemoWebSSH = React.memo(WebSSH, (prevProps, nextProps) => {
  return prevProps.hostList === nextProps.hostList;
});

function stateInit() {
  return [
    {
      label: '窗口',
      index: 0
    }
  ];
}

function stateReducer(state, action: any) {
  switch (action.type) {
    case 'update':
      return state.map((e) => {
        if (e.index === action.index) {
          return { ...e, [action.key]: action.payload };
        } else {
          return e;
        }
      });
    case 'add':
      return [
        ...state,
        {
          label: '窗口',
          index: new Date().getTime()
        }
      ];
    case 'remove':
      return state.filter((e) => e.index !== action.index);
    case 'reset':
      return stateInit();
    default:
      throw new Error();
  }
}

const WebSSHPage = ({ hostList, updateHostList, initQuickCommandAction, quickCommandList }: tProps) => {
  const [value, setValue] = useState(0);
  const [pageList, pageDispatch] = useReducer(stateReducer, stateInit(), stateInit);

  useEffect(() => {
    updateHostList();
    initQuickCommandAction();
  }, []);

  const handleChange = (event: React.ChangeEvent<any>, newValue: number) => {
    setValue(newValue);
  };
  const addTab = () => {
    pageDispatch({ type: 'add' });
  };
  const removeTab = (index) => {
    pageDispatch({ type: 'remove', index });
  };
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ChromeTabs variant="scrollable" scrollButtons="auto" value={value} onChange={handleChange} aria-label="上传文件">
        {pageList.map((p, i) => (
          <ChromeTab
            key={p.index}
            label={
              <div style={{ display: 'flex', justifyContent: 'space-around', width: '100%' }}>
                <span>{p.label + (i + 1)}</span>
                <Tooltip title="关闭窗口" placement="top-start">
                  <CloseIcon fontSize="small" color="error" onClick={() => removeTab(p.index)} />
                </Tooltip>
              </div>
            }
            {...a11yProps(p.index)}
          />
        ))}
        <Tooltip title="新窗口" placement="top-start">
          <IconButton color="primary" onClick={addTab}>
            <AddIcon />
          </IconButton>
        </Tooltip>
      </ChromeTabs>
      {pageList.map((p, index) => (
        <ChromeTabPanel key={p.index} value={value} index={index} style={{ height: '95%' }}>
          <MemoWebSSH hostList={hostList} quickCommandList={quickCommandList} />
        </ChromeTabPanel>
      ))}
    </div>
  );
};

export default connect(mapStateToProps, mapDispatch)(WebSSHPage);
