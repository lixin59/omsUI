import React, { useState } from 'react';
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
      width: '25%'
    },
    LinkButton: {
      marginTop: '12px',
      height: '45px',
      width: '90px',
      backgroundColor: theme.palette.info[theme.palette.type],
      '&:hover': {
        backgroundColor: theme.palette.info.main
      }
    },
    LinkOffButton: {
      marginTop: '12px',
      height: '45px',
      width: '90px',
      backgroundColor: theme.palette.error[theme.palette.type],
      '&:hover': {
        backgroundColor: theme.palette.error.main
      }
    },
    shellBox: {
      marginTop: '60px',
      width: '100%',
      height: '70%'
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

const Command = ({ hostList, groupList, tagList }: tProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();
  const [type, setType] = useState<string>('');
  const [item, setItem] = useState<string>('');
  const [ws, setWs] = useState<'' | WebSocket>('');

  const connectHost = () => {
    // console.log(item);
    if (!item) {
      enqueueSnackbar(`请先选择一个主机 ${type}`, {
        autoHideDuration: 3000,
        variant: 'error'
      });
      return;
    }
    // const ws = new WebSocket(`ws://10.1.1.74:9090/ws/ssh/${item}?cols=150&rows=40`);
    setWs(new WebSocket(`${baseUrl}ssh/${item}?cols=150&rows=40`));
  };

  const closeHost = () => {
    if (!ws) {
      return;
    }
    // enqueueSnackbar('正在关闭WebSocket连接...', {
    //   autoHideDuration: 3000,
    //   variant: 'info'
    // });
    (ws as WebSocket).close();
    setWs('');
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
    setItem(event.target.value as string);
    // console.log(type);
    // console.log(item);
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
            disabled={!selectType(true).length}
            labelId='typeItem-select-label'
            id='typeItem-select-label'
            value={item}
            onChange={handleChange}
          >
            {selectType(true).length > 0 ? (selectType(true) as Array<any>).map((e) => {
              return (<OmsMenuItem key={e.name} value={e.id}>{e.name}</OmsMenuItem>);
            }) : null }
          </OmsSelect>
        </FormControl>
        <Button
          disabled={!!ws}
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
)(Command);
