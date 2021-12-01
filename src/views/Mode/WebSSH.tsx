import React, { useEffect, useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import LinkIcon from '@material-ui/icons/Link';
import LinkOffIcon from '@material-ui/icons/LinkOff';
import FormControl from '@material-ui/core/FormControl';
import OmsSelect from '../../components/OmsSelect';
// import { ActionCreator } from 'redux';
import { GroupInfo, HostInfo, IState, TagInfo } from '../../store/interface';
import OmsTerminal from '../../components/OmsTerminal';
import { connect } from 'react-redux';
import OmsLabel from '../../components/OmsLabel';
import OmsMenuItem from '../../components/OmsSelect/OmsMenuItem';
import OmsError from '../../components/OmsError';
import { useSnackbar } from 'notistack';
import { baseUrl } from '../../api/websocket/url';
import { useLocation } from 'react-router-dom';

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
      marginTop: '20px',
      width: '100%',
      height: '70%'
    }
  })
);

const WebSSH = ({ hostList, groupList, tagList }: tProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();
  const [item, setItem] = useState<number>(0);
  const [ws, setWs] = useState<'' | WebSocket>('');

  const pathname = useLocation().pathname;

  useEffect(() => {
    const id = Number(pathname.replace(/\/mode\/web_ssh\//g, ''));
    if (id !== 0) {
      setItem(id);
      connectHost();
    }
  }, [item]);

  const connectHost = () => {
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
    (ws as WebSocket).close();
    setWs('');
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
            labelId='typeItem-select-label'
            id='typeItem-select-label'
            value={item || ''}
            onChange={handleChange}
          >
            {hostList.map((e) => {
              return (<OmsMenuItem key={e.name} value={e.id}>{e.name}</OmsMenuItem>);
            })}
          </OmsSelect>
        </FormControl>
        <Button
          disabled={!item || !!ws}
          className={classes.LinkButton}
          startIcon={<LinkIcon />}
          onClick={connectHost}
        >
          连接
        </Button>
        <Button
          disabled={!ws}
          className={classes.LinkOffButton}
          startIcon={<LinkOffIcon />}
          onClick={closeHost}
        >
          断开
        </Button>
      </div>
      <div className={classes.shellBox}>
        {ws ? (<OmsTerminal id='terminal' ws={ws as WebSocket} onCloseTodo={() => setWs('')}/>)
          : (<OmsError errInfo='请选择一个主机进行连接' errType='network' imgStyle={{ width: '400px', height: '400px' }} variant='h4'/>)}
      </div>
    </div>
  );
};

export default connect(
  mapStateToProps,
  mapDispatch
)(WebSSH);
