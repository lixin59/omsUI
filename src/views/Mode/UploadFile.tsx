import React, { useEffect, useState, SyntheticEvent } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import UploadButtons from '../../components/Button/UploadButton';
import OmsSelect from '../../components/OmsSelect';
import TextField from '@material-ui/core/TextField';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import IconButton from '@mui/material/IconButton';
import CancelIcon from '@mui/icons-material/Cancel';
import Tooltip from '@mui/material/Tooltip';
import LinearProgressWithLabel from '../../components/UploadFileProgress/Linear';
import { ActionCreator } from 'redux';
import { GroupInfo, HostInfo, IState, TagInfo } from '../../store/interface';
import actions from '../../store/action';
import { connect } from 'react-redux';
import OmsLabel from '../../components/OmsLabel';
import OmsMenuItem from '../../components/OmsSelect/OmsMenuItem';
import { baseUrl, url } from '../../api/websocket/url';
import { useSnackbar } from 'notistack';
import { uniqBy } from 'lodash';
import { uploadFileCancelApi } from '../../api/http/httpRequestApi';

type tDP = {
  updateGroupList: ActionCreator<any>;
  updateTagList: ActionCreator<any>;
  updateHostList: ActionCreator<any>;
};

type tOP = any;

type tSP = {
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
  updateGroupList: actions.updateGroupList,
  updateTagList: actions.updateTagList,
  updateHostList: actions.getHostList
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
  hostList: '请选择主机',
  groupList: '请选择分组',
  tagList: '请选择标签',
  default: '请选择子选项'
};

let oldList: any[] = [];

const UploadFile = ({ hostList, groupList, tagList, updateHostList, updateTagList, updateGroupList }: tProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();
  const [type, setType] = useState<string>('');
  const [item, setItem] = useState<number | string>('');
  const [filePath, setFilePath] = useState<string>('');
  // const [ws, setWs] = useState<'' | WebSocket>('');
  const [uploadList, setUploadList] = useState<tUploadFile[]>([]);
  const [ipList, setIpList] = useState<string[]>([]);
  const [expanded, setExpanded] = useState<string | false>(false);

  useEffect(() => {
    updateHostList();
    updateTagList();
    updateGroupList();
  }, []);

  useEffect(() => {
    const webSocket = new WebSocket(`${baseUrl}${url.index}`);
    // setWs(webSocket);
    webSocket.onopen = (evt) => {
      // console.log('WebSocket服务器连接成功上传文件');
      webSocket.send(JSON.stringify({ type: 'FILE_STATUS' }));
    };
    webSocket.onmessage = (evt) => {
      // console.log('收到消息');
      // console.log(JSON.parse(evt.data));
      const { data } = JSON.parse(evt.data);
      oldList.forEach((e, i) => {
        data.forEach((x) => {
          if (e?.id === x?.id) {
            oldList[i] = x;
          }
        });
      });
      const newList = uniqBy([...oldList, ...data], 'id'); // 数组去重
      oldList = newList;
      const ipAddrList = [...new Set([...ipList, ...newList.map((e) => e.dest)])];
      setUploadList(newList);
      setIpList(ipAddrList);
    };
    webSocket.onerror = (evt) => {
      console.warn(evt);
      enqueueSnackbar(` WebSocket服务器连接失败: ${evt.type}`, {
        autoHideDuration: 2000,
        variant: 'error'
      });
    };
    webSocket.onclose = function (evt) {
      console.log('Connection closed.', evt);
      // enqueueSnackbar(` WebSocket连接已关闭 上传文件: ${evt.type}`, {
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

  const onAccordionChange = (panel: string) => (event: SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  const cancelUploadFile = async (data: { addr: string; file: string }) => {
    try {
      const res = await uploadFileCancelApi(data);
      if (res.code === '200') {
        enqueueSnackbar(`${data.addr}: ${data.file} 已取消上传`, {
          autoHideDuration: 10000,
          variant: 'success'
        });
      }
    } catch (e) {
      enqueueSnackbar(`${data.addr}: ${data.file} 取消上传失败 ${e}`, {
        autoHideDuration: 10000,
        variant: 'error'
      });
    }
  };

  return (
    <div className={classes.root}>
      <div className={classes.ControlBox}>
        <FormControl className={classes.Control}>
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
            value={item}
            onChange={handleChange}>
            {selectType(true).length > 0
              ? (selectType(true) as Array<TagInfo | GroupInfo | HostInfo>).map((e) => (
                  <OmsMenuItem key={e.name} value={e.id}>
                    {e.name}
                  </OmsMenuItem>
                ))
              : null}
          </OmsSelect>
        </FormControl>
      </div>
      <div className={classes.ControlBox}>
        <TextField
          className={classes.Control}
          size="small"
          id="outlined-disabled"
          label="请输入远程端文件存储的路径"
          variant="outlined"
          value={filePath}
          onChange={(e) => setFilePath(e.target.value)}
        />
        <UploadButtons filePath={filePath} typeId={item as number} type={type as 'host' | 'group' | 'tag'} />
      </div>
      <div className={classes.shellBox}>
        {ipList &&
          ipList.map((str) => {
            return (
              <Accordion key={str} expanded={expanded === str} onChange={onAccordionChange(str)}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls={`${str}content`} id={`${str}header`}>
                  <Typography sx={{ width: '20%', flexShrink: 0 }}>{str}</Typography>
                  <Typography sx={{ color: 'text.secondary', width: '15%', flexShrink: 0 }}>
                    共{uploadList.filter((f) => f.dest === str).length}个文件
                  </Typography>
                  <Typography sx={{ width: '15%', flexShrink: 0 }} color="secondary">
                    上传中:{uploadList.filter((f) => f.dest === str)?.filter((f) => f.status === 'running').length}
                  </Typography>
                  <Typography sx={{ width: '15%', flexShrink: 0 }} color="primary">
                    已上传:{uploadList.filter((f) => f.dest === str)?.filter((f) => f.status === 'done').length}
                  </Typography>
                  <Typography sx={{ width: '15%', flexShrink: 0 }} color="error">
                    失败:{uploadList.filter((f) => f.dest === str)?.filter((f) => f.status === 'failed').length}
                  </Typography>
                  <Typography sx={{ width: '15%', flexShrink: 0 }} style={{ color: '#ffb74d' }}>
                    取消:{uploadList.filter((f) => f.dest === str)?.filter((f) => f.status === 'cancel').length}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {uploadList
                    .filter((f) => f.dest === str)
                    .map((e) => (
                      <div key={e.id} style={{ display: 'flex', alignItems: 'center' }}>
                        <LinearProgressWithLabel
                          dest={e.dest}
                          total={e.total}
                          value={e.percent}
                          file={e.file}
                          speed={e.speed}
                          status={e.status}
                        />
                        <Tooltip title="取消上传">
                          <IconButton
                            aria-label="cancel"
                            style={{ width: '50px', height: '50px' }}
                            disabled={e.status !== 'running'}
                            onClick={() => cancelUploadFile({ addr: e.dest, file: e.file })}
                            color="warning">
                            <CancelIcon />
                          </IconButton>
                        </Tooltip>
                      </div>
                    ))}
                </AccordionDetails>
              </Accordion>
            );
          })}
      </div>
    </div>
  );
};

export default connect(mapStateToProps, mapDispatch)(UploadFile);
