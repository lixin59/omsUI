import React, { useEffect, useState } from 'react';
import HTTP from '../../components/HTTP/index';
import {
  AddHostPost,
  getHostsApi,
  addHostApi,
  HTTPResult,
  getGroupsApi,
  getTagsApi,
  getPrivateKeysApi
} from '../../api/http/httpRequestApi';
import Loading from '../../components/OmsSkeleton/Loading';
import OmsError from '../../components/OmsError';
import { ActionCreator } from 'redux';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import actions from '../../store/action';
import imac from '../../assets/icons/imac.svg';
import BodyBox from '../../components/Bodybox';
import HostInfoCard from '../../components/HostInfoCard';
import HostInfoForm from '../../components/HostInfoCard/hostInfoForm';
import { GroupInfo, IState, TagInfo, HostInfo, PrivateKeyInfo } from '../../store/interface';
import homeStyle from './homStyle';
import FormDialog from '../../components/OmsDialog/FormDialog';
import { useSnackbar } from 'notistack';
type tDP = {
  initGroup: ActionCreator<any>;
  initTag: ActionCreator<any>;
  initPrivateKey: ActionCreator<any>;
  deleteHost: ActionCreator<any>;
  addHost: ActionCreator<any>;
  editHost: ActionCreator<any>;
  initStore: ActionCreator<any>;
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
  initStore: actions.initHostInfo
};

type tProps = tSP & tDP;

function Home(props: tProps) {
  const { hostList, addHost, initTag, initGroup, initPrivateKey, privateKeyList, groupList, tagList, initStore } =
    props;

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

  const [open, setOpen] = useState<boolean>(false);
  const [hostInfo, setHostInfo] = useState<HostInfo>(baseHostInfo);
  const [tlc, setTlc] = useState(tagList?.map((e) => ({ ...e, checked: false })));

  const title = '添加一个新的主机';
  const content = HostInfoForm({ hostInfo, setHostInfo, privateKeyList, groupList, tlc, setTlc });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const addNewHost = async () => {
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
  };

  return (
    <BodyBox>
      <HTTP.Get
        data={hostList}
        initStore={initStore}
        apiFn={getHostsApi}
        // delay={500}
        loading={<Loading />}
        dataIsEmpty={
          <OmsError
            errInfo="您还未添加主机，请在右下角点击“添加主机”按钮添加您的主机。"
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
      <Fab
        variant="extended"
        size="medium"
        color="primary"
        aria-label="add"
        className={classes.FabButton}
        onClick={handleClickOpen}>
        <AddIcon />
        添加主机
      </Fab>
      <FormDialog open={open} content={content} toClose={handleClose} title={title} todo={addNewHost} />
    </BodyBox>
  );
}

export default connect(
  mapStateToProps, // 把仓库的状态映射为组件的属性对象
  mapDispatch
)(Home);
