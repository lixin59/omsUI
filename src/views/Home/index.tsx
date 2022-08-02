import React, { useEffect, useReducer, useState, useCallback } from 'react';
import HTTP from '../../components/HTTP/index';
import {
  AddHostPost,
  getHostsApi,
  addHostApi,
  HTTPResult,
  getGroupsApi,
  getTagsApi,
  getPrivateKeysApi,
  deleteHostApi,
  EditHostPut,
  editHostApi
} from '../../api/http/httpRequestApi';
import Loading from '../../components/OmsSkeleton/Loading';
import OmsError from '../../components/OmsError';
import { ActionCreator } from 'redux';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import actions from '../../store/action';
import IconButton from '@material-ui/core/IconButton';
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted';
import Stack from '@mui/material/Stack';
import AppsIcon from '@material-ui/icons/Apps';
import imac from '../../assets/icons/imac.svg';
import BodyBox from '../../components/Bodybox';
import HostInfoCard from '../../components/HostInfoCard';
import HostInfoForm from '../../components/HostInfoCard/hostInfoForm';
import { GroupInfo, IState, TagInfo, HostInfo, PrivateKeyInfo } from '../../store/interface';
import homeStyle from './homStyle';
import FormDialog from '../../components/OmsDialog/FormDialog';
import { useSnackbar } from 'notistack';
import HostInfoTable from '../../components/HostInfoCard/HostInfoTable';
import TipDialog from '../../components/OmsDialog/TipDialog';
import Tooltip from '@material-ui/core/Tooltip';
import IosShareIcon from '@mui/icons-material/IosShare';
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';
import { baseUrl, urlType } from '../../api/http/requestUrl';
import { downloadFile } from '../../utils';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import ImportAssetsFile from '../../components/Button/ImportAssetsFile';

type tDP = {
  initGroup: ActionCreator<any>;
  initTag: ActionCreator<any>;
  initPrivateKey: ActionCreator<any>;
  deleteHost: ActionCreator<any>;
  addHost: ActionCreator<any>;
  editHost: ActionCreator<any>;
  initStore: ActionCreator<any>;
  getHostList: ActionCreator<any>;
};

type tOP = any;

type tSP = tOP & {
  hostList: HostInfo[];
  groupList: GroupInfo[];
  tagList: TagInfo[];
  privateKeyList: PrivateKeyInfo[];
};

const baseHostInfo: HostInfo = {
  id: 0,
  name: '',
  status: false,
  user: '',
  password: '',
  addr: '',
  keyFile: '',
  private_key_id: 0,
  port: 22,
  vnc_port: 5900,
  group: {
    id: 0,
    name: '',
    mode: 0,
    params: ''
  },
  tags: [],
  tunnels: [],
  jobs: []
};

const mapStateToProps = (state: IState, props: tOP): tSP => ({
  ...props,
  hostList: state.hostList,
  groupList: state.groupList,
  tagList: state.tagList,
  privateKeyList: state.privateKeyList
});
const mapDispatch: tDP = {
  initGroup: actions.initGroupInfo,
  initTag: actions.initTagInfo,
  initPrivateKey: actions.initPrivateKeyInfo,
  deleteHost: actions.deleteHostInfo,
  addHost: actions.addHostInfo,
  editHost: actions.editHostInfo,
  initStore: actions.initHostInfo,
  getHostList: actions.getHostList
};

type tProps = tSP & tDP;

function formInit() {
  return {
    open: false,
    title: ''
  };
}

function formReducer(state, action: any) {
  switch (action.type) {
    case 'open':
      return { ...state, open: true };
    case 'close':
      return { ...state, open: false };
    case 'title':
      return { ...state, title: action.payload };
    case 'reset':
      return formInit();
    default:
      throw new Error();
  }
}

function tipInit() {
  return {
    open: false,
    text: '',
    title: '',
    todo: (a) => a
  };
}

function tipReducer(state, action: any) {
  switch (action.type) {
    case 'open':
      return { ...state, open: true };
    case 'close':
      return { ...state, open: false };
    case 'text':
      return { ...state, text: action.payload };
    case 'title':
      return { ...state, title: action.payload };
    case 'todo':
      return { ...state, todo: action.payload };
    case 'reset':
      return tipInit();
    default:
      throw new Error();
  }
}

function Home(props: tProps) {
  const {
    hostList,
    addHost,
    editHost,
    getHostList,
    initTag,
    initGroup,
    initPrivateKey,
    privateKeyList,
    groupList,
    tagList,
    initStore
  } = props;

  useEffect(() => {
    (async () => {
      const res = (await getGroupsApi()) as HTTPResult;
      const res1 = (await getTagsApi()) as HTTPResult;
      const res2 = (await getPrivateKeysApi()) as HTTPResult;
      if (res.code !== '200') {
        return;
      }
      if (res1.code !== '200') {
        return;
      }
      if (res2.code !== '200') {
        return;
      }
      initGroup(res.data);
      initTag(res1.data);
      initPrivateKey(res2.data);
      setTlc(res1.data?.map((e: TagInfo) => ({ ...e, checked: false })));
    })();
  }, []);

  const classes = makeStyles(homeStyle)();
  const { enqueueSnackbar } = useSnackbar();

  const [id, setId] = useState<number>(0);
  const [tip, tipDispatch] = useReducer(tipReducer, tipInit(), tipInit);
  const [form, formDispatch] = useReducer(formReducer, formInit(), formInit);
  const [hostInfo, setHostInfo] = useState<HostInfo>(baseHostInfo);
  const [tlc, setTlc] = useState(tagList?.map((e) => ({ ...e, checked: false })));
  const viewTypeLocal = (localStorage.getItem('viewType') as 'card' | 'table') || 'card';
  const [viewType, setViewType] = useState<'card' | 'table'>(viewTypeLocal);
  const [open, setOpen] = useState<boolean>(false);

  const addcontent = HostInfoForm({ hostInfo, setHostInfo, privateKeyList, groupList, tlc, setTlc });

  const editContent = HostInfoForm({ hostInfo, setHostInfo, privateKeyList, groupList, tlc, setTlc });

  const viewComponent = {
    card: (
      <HTTP.Get
        data={hostList}
        initStore={initStore}
        apiFn={getHostsApi}
        // delay={500}
        loading={<Loading />}
        dataIsEmpty={
          <OmsError
            errInfo="您还未添加主机，请点击“+”按钮添加您的主机。"
            variant="h5"
            svgImg={imac}
            errType="server"
            imgStyle={{ width: '400px', height: '400px' }}
            style={{ marginTop: '40px' }}
          />
        }
        error={
          <div style={{ marginTop: '100px' }}>
            <OmsError
              errInfo="请求数据失败，网络异常"
              variant="h3"
              errType="server"
              imgStyle={{ width: '400px', height: '400px' }}
            />
          </div>
        }>
        {
          <div
            style={{
              width: '90%',
              margin: '0 auto',
              paddingTop: '20px',
              paddingBottom: '20px',
              display: 'grid',
              alignContent: 'space-evenly',
              alignItems: 'center',
              justifyContent: 'space-between',
              justifyItems: 'center',
              gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
              gridGap: '20px 20px'
            }}>
            {hostList?.map((i: HostInfo) => {
              return <HostInfoCard hostInfo={i} key={i.id} />;
            })}
          </div>
        }
      </HTTP.Get>
    ),
    table: (
      <HostInfoTable
        setHostInfo={setHostInfo}
        setHostId={setId}
        tipDispatch={tipDispatch}
        formDispatch={formDispatch}
      />
    )
  };

  const handleClickOpen = () => {
    formDispatch({ type: 'title', payload: '添加一个新的主机' });
    formDispatch({ type: 'open' });
  };

  const editNewHost = async () => {
    const tags: TagInfo[] = [];
    tlc.forEach((e) => {
      if (e.checked) {
        tags.push(e);
      }
    });
    const resData: EditHostPut = {
      id: hostInfo.id,
      hostname: hostInfo.name,
      user: hostInfo.user,
      addr: hostInfo.addr,
      port: hostInfo.port,
      vnc_port: hostInfo.vnc_port,
      password: hostInfo.password || '',
      private_key_id: hostInfo.private_key_id,
      group: hostInfo?.group?.id,
      tags: JSON.stringify(tags?.map((e) => e.id))
    };
    const res = (await editHostApi(resData)) as HTTPResult;

    if (res.code !== '200') {
      enqueueSnackbar(`主机修改失败: ${res.msg}`, {
        autoHideDuration: 3000,
        variant: 'error'
      });
      return;
    }
    editHost(res.data);
    enqueueSnackbar(`主机: ${hostInfo.name} 信息已经修改`, {
      autoHideDuration: 3000,
      variant: 'success'
    });
  };

  const addNewHost = useCallback(async () => {
    if (!hostInfo.addr) {
      enqueueSnackbar(`主机地址不能为空`, {
        autoHideDuration: 3000,
        variant: 'error'
      });
      return;
    }
    if (!hostInfo.user) {
      enqueueSnackbar(`用户名不能为空`, {
        autoHideDuration: 3000,
        variant: 'error'
      });
      return;
    }
    if (!hostInfo.name) {
      enqueueSnackbar(`主机名不能为空`, {
        autoHideDuration: 3000,
        variant: 'error'
      });
      return;
    }
    // if (hostList.some((e) => e.addr === hostInfo.addr)) {
    //   enqueueSnackbar(`该主机已存在`, {
    //     autoHideDuration: 3000,
    //     variant: 'error'
    //   });
    //   return;
    // }
    const tags: TagInfo[] = [];
    tlc.forEach((e) => {
      if (e.checked) {
        tags.push(e);
      }
    });
    const data: HostInfo = {
      ...hostInfo,
      tags
    };
    const resData: AddHostPost = {
      hostname: data.name,
      user: data.user,
      addr: data.addr,
      port: data.port,
      vnc_port: data.vnc_port,
      group: data.group.id,
      password: data.password,
      private_key_id: data.private_key_id,
      tags: JSON.stringify(data.tags?.map((e: TagInfo) => e.id))
    };

    // console.log(resData);

    const res = (await addHostApi(resData)) as HTTPResult;
    if (res.code !== '200') {
      enqueueSnackbar(`主机添加失败: ${res.msg}`, {
        autoHideDuration: 3000,
        variant: 'error'
      });
      return;
    }
    addHost(res.data);
    enqueueSnackbar(`主机: ${res.data.name} 已添加`, {
      autoHideDuration: 3000,
      variant: 'success'
    });
    setHostInfo(baseHostInfo);
    setTlc(tagList?.map((e) => ({ ...e, checked: false })));
  }, [hostInfo]);

  return (
    <BodyBox>
      <div style={{ width: '100%', height: '40px', display: 'flex', justifyContent: 'end' }}>
        <Stack direction="row" spacing={1}>
          <Tooltip title="导入数据" placement="top-start">
            <IconButton aria-label="hostCard" color="secondary" onClick={() => setOpen(true)}>
              <SystemUpdateAltIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="导出数据" placement="top-start">
            <IconButton
              aria-label="hostCard"
              color="secondary"
              onClick={() => {
                const url = `${baseUrl}${urlType.tools.export}`;
                downloadFile(url, 'oms');
              }}>
              <IosShareIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="添加主机" placement="top-start">
            <IconButton aria-label="hostCard" color="secondary" onClick={handleClickOpen}>
              <AddIcon />
            </IconButton>
          </Tooltip>
          <IconButton
            aria-label="hostCard"
            color={viewType === 'card' ? 'primary' : 'default'}
            onClick={() => {
              setViewType('card');
              localStorage.setItem('viewType', 'card');
            }}>
            <AppsIcon />
          </IconButton>
          <IconButton
            aria-label="hostTable"
            color={viewType === 'table' ? 'primary' : 'default'}
            onClick={() => {
              setViewType('table');
              localStorage.setItem('viewType', 'table');
            }}>
            <FormatListBulletedIcon />
          </IconButton>
        </Stack>
      </div>
      {viewComponent[viewType]}
      <FormDialog
        open={form.open}
        content={id ? editContent : addcontent}
        toClose={() => formDispatch({ type: 'close' })}
        title={form.title}
        todo={id ? editNewHost : addNewHost}
      />
      <TipDialog
        open={tip.open}
        text={tip.text}
        title={tip.title}
        toClose={() => tipDispatch({ type: 'close' })}
        todo={tip.todo}
      />
      <Dialog open={open} onClose={() => setOpen(false)} aria-labelledby="file-browser" fullWidth maxWidth={'sm'}>
        <DialogContent
          style={{ minHeight: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'center ' }}
          dividers>
          <DialogContentText>
            <ImportAssetsFile
              onBeforeUpload={() => {
                setOpen(false);
              }}
              onUploadComplete={getHostList}
              // showUploadProgress={true}
            />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary">
            关闭
          </Button>
        </DialogActions>
      </Dialog>
    </BodyBox>
  );
}

export default connect(
  mapStateToProps, // 把仓库的状态映射为组件的属性对象
  mapDispatch
)(Home);
