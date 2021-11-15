import React, { useEffect, useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import UploadButtons from '../../components/Button/UploadButton';
import OmsSelect from '../../components/OmsSelect';
import TextField from '@material-ui/core/TextField';
import LinearProgressWithLabel from '../../components/UploadFileProgress/Linear';
// import { ActionCreator } from 'redux';
import { GroupInfo, HostInfo, IState, TagInfo } from '../../store/interface';
// import actions from '../../store/action';
import { connect } from 'react-redux';
import OmsLabel from '../../components/OmsLabel';
import OmsMenuItem from '../../components/OmsSelect/OmsMenuItem';
import { baseUrl, url } from '../../api/websocket/url';

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
      width: '100%',
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
    shellBox: {
      width: '100%',
      height: '70%'
      // backgroundColor: '#2f2f2f'
    }
  })
);

type tItem = 'hostList' | 'groupList' | 'tagList' | 'default';

const itemType = {
  hostList: '请选择主机',
  groupList: '请选择分组',
  tagList: '请选择标签',
  default: '请选择子选项'
};

const UploadFile = ({ hostList, groupList, tagList }: tProps) => {
  const classes = useStyles();
  const [type, setType] = useState<string>('');
  const [item, setItem] = useState<number| string>('');
  const [filePath, setFilePath] = useState<string>('');
  // const [ws, setWs] = useState<'' | WebSocket>('');
  const [uploadList, setUploadList] = useState([{
    current: '40.81mb',
    dest: '192.168.50.102:22',
    file: 'ControlPanel-SA Setup 2.4.19-TS013.exe',
    percent: 50.1744,
    speed: '1.71mb/s',
    status: 'running',
    total: '202.28mb'
  }]);

  useEffect(() => {
    const webSocket = new WebSocket(`${baseUrl}${url.index}`);
    // setWs(webSocket);
    webSocket.onopen = (evt) => {
      console.log('WebSocket服务器连接成功');
      webSocket.send(JSON.stringify({ type: 'FILE_STATUS' }));
    };
    webSocket.onmessage = (evt) => {
      console.log('收到消息');
      console.log(JSON.parse(evt.data));
      setUploadList(JSON.parse(evt.data).data);
    };
    return () => {
      webSocket.close();
    };
  }, []);

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
    console.log(type);
    console.log(item);
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
            labelId='typeItem-select-label'
            id='typeItem-select-label'
            value={item}
            onChange={handleChange}
          >
            {selectType(true).length > 0 ? (selectType(true) as Array<TagInfo | GroupInfo | HostInfo>).map((e) => {
              return (<OmsMenuItem key={e.name} value={e.id}>{e.name}</OmsMenuItem>);
            }) : null }
          </OmsSelect>
        </FormControl>
      </div>
      <div className={classes.ControlBox}>
        <TextField
          className={classes.Control}
          size='small'
          id='outlined-disabled'
          label='请输入远程端文件存储的路径'
          variant='outlined'
          value={filePath}
          onChange={(e) => setFilePath(e.target.value)}
        />
        <UploadButtons filePath={filePath} typeId={item as number} type={type as 'host' | 'group' | 'tag'}/>
      </div>
      <div className={classes.shellBox}>
        {uploadList && uploadList.map((e) => {
          return (
            <LinearProgressWithLabel
              key={e.dest}
              dest={e.dest}
              total={e.total}
              value={e.percent}
              file={e.file}
              speed={e.speed}
              status={e.status}
            />);
        })}
      </div>
    </div>
  );
};

export default connect(
  mapStateToProps,
  mapDispatch
)(UploadFile);
