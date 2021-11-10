import React, { useState } from 'react';
import { ActionCreator } from 'redux';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import actions from '../../store/action';
import BodyBox from '../../components/Bodybox';
import HostInfoCard from '../../components/HostInfoCard';
import HostInfoForm from '../../components/HostInfoCard/hostInfoForm';
import { GroupInfo, IState, TagInfo, HostInfo } from '../../store/interface';
import homeStyle from './homStyle';
import FormDialog from '../../components/OmsDialog/FormDialog';
import { useSnackbar } from 'notistack';

type tDP = {
  deleteHost: ActionCreator<any>;
  addHost: ActionCreator<any>;
  editHost: ActionCreator<any>;
};

type tOP = {};

type tSP = tOP & {
  hostList: HostInfo[],
  groupList: GroupInfo[],
  tagList: TagInfo[]
};

const baseHostInfo: HostInfo = {
  id: 0,
  name: '',
  status: false,
  user: '',
  password: '',
  addr: '',
  private_key_id: 0,
  port: '',
  group: {
    id: 0,
    name: '',
    mode: 0,
    rule: ''
  },
  tags: [],
  tunnels: [],
  jobs: []
};

const mapStateToProps = (state: IState, props: tOP): tSP => ({
  ...props,
  hostList: state.hostList,
  groupList: state.groupList,
  tagList: state.tagList
});
const mapDispatch: tDP = {
  deleteHost: actions.deleteHostInfo,
  addHost: actions.addHostInfo,
  editHost: actions.editHostInfo
};

type tProps = tSP & tDP;

function Home(props: tProps) {
  const { hostList, deleteHost, addHost, editHost, groupList, tagList } = props;
  const classes = makeStyles(homeStyle)();
  const { enqueueSnackbar } = useSnackbar();

  const [open, setOpen] = useState<boolean>(false);
  const [hostInfo, setHostInfo] = useState<HostInfo>(baseHostInfo);
  const [tlc, setTlc] = useState(tagList.map((e) => ({ ...e, checked: false })));

  const title = '添加一个新的主机';
  const content = HostInfoForm({ hostInfo, setHostInfo, groupList, tlc, setTlc });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const addNewHost = () => {
    if (!hostInfo.addr) {
      enqueueSnackbar(`主机地址不能为空`, {
        autoHideDuration: 3000,
        variant: 'error'
      });
      return;
    }
    if (!hostInfo.user) {
      enqueueSnackbar(`主机名不能为空`, {
        autoHideDuration: 3000,
        variant: 'error'
      });
      return;
    }
    if (!hostInfo.name) {
      enqueueSnackbar(`用户名不能为空`, {
        autoHideDuration: 3000,
        variant: 'error'
      });
      return;
    }
    if (hostList.some((e) => e.addr === hostInfo.addr)) {
      enqueueSnackbar(`该主机已存在`, {
        autoHideDuration: 3000,
        variant: 'error'
      });
      return;
    }
    const tags: TagInfo[] = [];
    tlc.forEach((e) => {
      if (e.checked) {
        tags.push(e);
      }
    });
    const data: HostInfo = {
      ...hostInfo,
      id: new Date().getTime(),
      tags
    };
    /* const res = api();
    if(code !==200) {
      enqueueSnackbar(`主机添加失败: res.mes`, {
       autoHideDuration: 3000,
       variant: 'success'
      });
      return;
    }
    id = res.id;
    * */
    addHost(data);
    enqueueSnackbar(`主机: ${hostInfo.name} 已添加`, {
      autoHideDuration: 3000,
      variant: 'success'
    });
    setHostInfo(baseHostInfo);
    setTlc(tagList.map((e) => ({ ...e, checked: false })));
  };

  return (
    <BodyBox>
      <div className={classes.home}>
        {hostList.map((i: HostInfo) => {
          return (
            <HostInfoCard
              hostInfo={i}
              key={i.id}
              deleteHost={deleteHost}
              editHost={editHost}
              groupList={groupList}
              tagList={tagList}
            />
          );
        })}
      </div>
      <Fab
        variant='extended'
        size='medium'
        color='primary'
        aria-label='add'
        className={classes.FabButton}
        onClick={handleClickOpen}
      >
        <AddIcon />
        添加主机
      </Fab>
      <FormDialog
        open={open}
        content={content}
        toClose={handleClose}
        title={title}
        todo={addNewHost}
      />
    </BodyBox>
  );
}

export default connect(
  mapStateToProps, // 把仓库的状态映射为组件的属性对象
  mapDispatch
)(Home);
