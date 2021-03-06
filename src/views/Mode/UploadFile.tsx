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
import { useSnackbar } from 'notistack';
import lodash from 'lodash';

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

type tUploadFile = {
  id: string;
  current: string;
  dest: string;
  file: string;
  percent: number;
  speed: string;
  status: 'running' | 'done' | 'failed' | string;
  total: string;
};

const itemType = {
  hostList: '???????????????',
  groupList: '???????????????',
  tagList: '???????????????',
  default: '??????????????????'
};

let oldList: any[] = [];

const UploadFile = ({ hostList, groupList, tagList }: tProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();
  const [type, setType] = useState<string>('');
  const [item, setItem] = useState<number | string>('');
  const [filePath, setFilePath] = useState<string>('');
  // const [ws, setWs] = useState<'' | WebSocket>('');
  const [uploadList, setUploadList] = useState<tUploadFile[]>([]);

  useEffect(() => {
    const webSocket = new WebSocket(`${baseUrl}${url.index}`);
    // setWs(webSocket);
    webSocket.onopen = (evt) => {
      console.log('WebSocket?????????????????????????????????');
      webSocket.send(JSON.stringify({ type: 'FILE_STATUS' }));
    };
    webSocket.onmessage = (evt) => {
      // console.log('????????????');
      // console.log(JSON.parse(evt.data));
      const { data } = JSON.parse(evt.data);
      oldList.forEach((e, i) => {
        data.forEach((x) => {
          if (e?.id === x?.id) {
            oldList[i] = x;
          }
        });
      });
      const newList = lodash.uniqBy([...oldList, ...data], 'id'); // ????????????
      oldList = newList;
      setUploadList(newList);
    };
    webSocket.onerror = (evt) => {
      console.warn(evt);
      enqueueSnackbar(` WebSocket?????????????????????: ${evt.type}`, {
        autoHideDuration: 2000,
        variant: 'error'
      });
    };
    webSocket.onclose = function (evt) {
      console.log('Connection closed.', evt);
      // enqueueSnackbar(` WebSocket??????????????? ????????????: ${evt.type}`, {
      //   autoHideDuration: 2000,
      //   variant: 'error'
      // });
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
    // console.log(type);
    // console.log(item);
  };

  return (
    <div className={classes.root}>
      <div className={classes.ControlBox}>
        <FormControl className={classes.Control}>
          <OmsLabel>???????????????</OmsLabel>
          <OmsSelect id="type-select" value={type} onChange={(e) => setType(e.target.value as string)}>
            <OmsMenuItem value={'host'}>??????</OmsMenuItem>
            <OmsMenuItem value={'group'}>???</OmsMenuItem>
            <OmsMenuItem value={'tag'}>??????</OmsMenuItem>
          </OmsSelect>
        </FormControl>
        <FormControl className={classes.Control}>
          <OmsLabel>{itemType[selectType(false) as tItem]}</OmsLabel>
          <OmsSelect
            disabled={!type}
            labelId="typeItem-select-label"
            id="typeItem-select-label"
            value={item}
            onChange={handleChange}>
            {selectType(true).length > 0
              ? (selectType(true) as Array<TagInfo | GroupInfo | HostInfo>).map((e) => {
                return (
                  <OmsMenuItem key={e.name} value={e.id}>
                    {e.name}
                  </OmsMenuItem>
                );
              })
              : null}
          </OmsSelect>
        </FormControl>
      </div>
      <div className={classes.ControlBox}>
        <TextField
          className={classes.Control}
          size="small"
          id="outlined-disabled"
          label="???????????????????????????????????????"
          variant="outlined"
          value={filePath}
          onChange={(e) => setFilePath(e.target.value)}
        />
        <UploadButtons filePath={filePath} typeId={item as number} type={type as 'host' | 'group' | 'tag'} />
      </div>
      <div className={classes.shellBox}>
        {uploadList &&
          uploadList.map((e) => {
            return (
              <LinearProgressWithLabel
                key={e.id}
                dest={e.dest}
                total={e.total}
                value={e.percent}
                file={e.file}
                speed={e.speed}
                status={e.status}
              />
            );
          })}
      </div>
    </div>
  );
};

export default connect(mapStateToProps, mapDispatch)(UploadFile);
