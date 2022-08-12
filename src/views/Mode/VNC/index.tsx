import React, { useEffect, useState, useRef } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import LinkIcon from '@material-ui/icons/Link';
import LinkOffIcon from '@material-ui/icons/LinkOff';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import FullscreenExitIcon from '@material-ui/icons/FullscreenExit';
import IconButton from '@material-ui/core/IconButton';
import FormControl from '@material-ui/core/FormControl';
import VNCSvg from '../../../assets/icons/vnc.svg';
import OmsSelect from '../../../components/OmsSelect';
import { ActionCreator } from 'redux';
import { HostInfo, IState } from '../../../store/interface';
import { VncScreen } from 'react-vnc';
import { connect } from 'react-redux';
import OmsLabel from '../../../components/OmsLabel';
import OmsMenuItem from '../../../components/OmsSelect/OmsMenuItem';
import OmsError from '../../../components/OmsError';
import { useSnackbar } from 'notistack';
import { websocketURL } from '../../../api/websocket/url';
import { useLocation } from 'react-router-dom';
import actions from '../../../store/action';

type tDP = {
  updateHostList: ActionCreator<any>;
};

// eslint-disable-next-line @typescript-eslint/ban-types
type tOP = {};

type tSP = tOP & {
  hostList: HostInfo[];
};

const mapStateToProps = (state: IState, props: tOP): tSP => ({
  ...props,
  hostList: state.hostList
});
const mapDispatch: tDP = {
  updateHostList: actions.getHostList
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
      backgroundColor: theme.palette.error[theme.palette.type],
      '&:hover': {
        backgroundColor: theme.palette.error.main
      }
    },
    shellBox: {
      width: '100%',
      // backgroundColor: '#e73131',
      height: '90%'
    },
    fullScreen: {
      position: 'absolute',
      top: '0px',
      left: '0px',
      width: '100vw',
      backgroundColor: '#bebebe',
      height: '100vh',
      zIndex: 9
    }
  })
);

const isValid = (vncUrl: string) => {
  if (!vncUrl.startsWith('ws://') && !vncUrl.startsWith('wss://')) {
    return false;
  }

  return true;
};

const VNC = ({ hostList, updateHostList }: tProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();
  const [item, setItem] = useState<number>(0);
  const [vncUrl, setVncUrl] = useState<string>('');
  const [isConnect, setIsConnect] = useState<boolean>(false);
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);

  const vncScreenRef = useRef<React.ElementRef<typeof VncScreen>>(null);

  const pathname = useLocation().pathname;

  useEffect(() => {
    updateHostList();
  }, []);

  useEffect(() => {
    const id = Number(pathname.replace(/\/mode\/vnc\//g, ''));
    if (id !== 0) {
      setVncUrl(`${websocketURL.vnc}${id}`);
      connectHost(id);
      setItem(id);
    }
  }, []);

  const escFunction = (e) => {
    setIsFullScreen((prevFill) => !prevFill);
  };

  useEffect(() => {
    // 监听退出全屏事件 --- chrome 用 esc 退出全屏并不会触发 keyup 事件
    document.addEventListener('webkitfullscreenchange', escFunction); /* Chrome, Safari and Opera */
    document.addEventListener('mozfullscreenchange', escFunction); /* Firefox */
    document.addEventListener('fullscreenchange', escFunction); /* Standard syntax */
    document.addEventListener('msfullscreenchange', escFunction); /* IE / Edge */
    return () => {
      // 销毁时清除监听
      document.removeEventListener('webkitfullscreenchange', escFunction);
      document.removeEventListener('mozfullscreenchange', escFunction);
      document.removeEventListener('fullscreenchange', escFunction);
      document.removeEventListener('MSFullscreenChange', escFunction);
    };
  }, []);

  const connectHost = (item: number) => {
    if (!item) {
      enqueueSnackbar(`请先选择一个主机`, {
        autoHideDuration: 3000,
        variant: 'error'
      });
      return;
    }
    const { connect, connected, disconnect } = vncScreenRef.current ?? {};
    if (connected) {
      disconnect?.();
    }
    connect?.();
  };

  const closeHost = () => {
    // enqueueSnackbar('正在关闭WebSocket连接...', {
    //   autoHideDuration: 3000,
    //   variant: 'info'
    // });
    const { connected, disconnect } = vncScreenRef.current ?? {};
    if (connected) {
      disconnect?.();
      setIsConnect(false);
    }
  };

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setItem(event.target.value as number);
    setVncUrl(`${websocketURL.vnc}${event.target.value as number}`);
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
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
          disabled={!item || !!isConnect}
          className={classes.LinkButton}
          startIcon={<LinkIcon />}
          onClick={() => connectHost(item)}>
          连接
        </Button>
        <Button disabled={!isConnect} className={classes.LinkOffButton} startIcon={<LinkOffIcon />} onClick={closeHost}>
          断开
        </Button>
      </div>
      <div className={isFullScreen ? classes.fullScreen : classes.shellBox}>
        <IconButton aria-label="fullScreen" color="primary" onClick={toggleFullScreen}>
          {isFullScreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
        </IconButton>
        {isValid(vncUrl) ? (
          <VncScreen
            url={vncUrl}
            scaleViewport
            background="#000000"
            style={isFullScreen ? { width: '100vw', height: '100vh' } : { width: '75vw', height: '75vh' }}
            onConnect={(rfb?) => {
              // console.log(rfb);
              if (rfb) {
                enqueueSnackbar(`已连接目标主机: ${rfb?._fbName}`, {
                  autoHideDuration: 3000,
                  variant: 'info'
                });
              }
              setIsConnect(true);
            }}
            onDisconnect={(rfb?) => {
              // console.log(rfb);
              // console.log(rfb?._fbName);
              if (rfb) {
                enqueueSnackbar(`无法连接目标主机`, {
                  autoHideDuration: 3000,
                  variant: 'error'
                });
              }
              return;
            }}
            onClipboard={(e?: { detail: { text: string } }) => {
              // todo 处理从目标主机复制的文本
              console.log(e);
            }}
            debug
            ref={vncScreenRef}
          />
        ) : (
          <OmsError
            errInfo="请选择一个主机进行连接"
            errType="network"
            imgStyle={{ width: '400px', height: '400px' }}
            variant="h4"
            svgImg={VNCSvg}
          />
        )}
      </div>
    </div>
  );
};

export default connect(mapStateToProps, mapDispatch)(VNC);
