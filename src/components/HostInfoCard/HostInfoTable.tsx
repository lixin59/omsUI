import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import OmsTable from '../OmsTable/index';
import Card from '@material-ui/core/Card';
import { GroupInfo, HostInfo, IState, PrivateKeyInfo, TagInfo } from '../../store/interface';
import EditIcon from '@material-ui/icons/Edit';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import CastConnectedIcon from '@material-ui/icons/CastConnected';
import DvrIcon from '@material-ui/icons/Dvr';
import Tooltip from '@material-ui/core/Tooltip';
import { connect } from 'react-redux';
import { ActionCreator } from 'redux';
import actions from '../../store/action';
import { GridActionsCellItem } from '@mui/x-data-grid';
import { GridRowParams } from '@mui/x-data-grid/models/params/gridRowParams';
import { GridValueGetterParams } from '@mui/x-data-grid/models/params/gridCellParams';
import { useNavigate } from 'react-router-dom';
import { URL } from '../../router';
import { deleteHostApi, HTTPResult } from '../../api/http/httpRequestApi';
import { useSnackbar } from 'notistack';

const columns = [
  {
    field: 'id',
    headerName: 'id',
    width: 80
  },
  {
    field: 'name',
    headerName: '主机名',
    width: 160
  },
  {
    field: 'status',
    headerName: '状态',
    width: 160,
    valueGetter: (params: GridValueGetterParams<HostInfo>) => {
      return params.row.status ? '在线' : '离线';
    }
  },
  {
    field: 'user',
    headerName: '用户',
    width: 160
    // valueGetter: getFullName,
  },
  {
    field: 'addr',
    headerName: '地址',
    width: 160
  },
  {
    field: 'port',
    headerName: '端口',
    width: 100
  },
  {
    field: 'group',
    headerName: '组',
    width: 130,
    valueGetter: (params: GridValueGetterParams<HostInfo>) => {
      return params.row.group.name;
    }
  },
  {
    field: 'tags',
    headerName: '标签',
    width: 180,
    valueGetter: (params: GridValueGetterParams<HostInfo>) => {
      return String(params?.row?.tags?.map((e) => e.name) || []);
    }
    // type: 'actions',
    // getActions: (params: GridRowParams<HostInfo>) => {
    //   return params.row.tags?.map((e) => <Chip size="small" key={e.id} label={e.name} />);
    // }
  },
  {
    field: 'action',
    headerName: '操作',
    minWidth: 240,
    type: 'actions',
    getActions: (params: GridRowParams) => {
      const { id, name } = params.row;
      const { navigate, openDelete, toDelete, openEdit, setHostId, setHostInfo, setTlc, tagList } = params.row.actions;
      return [
        <GridActionsCellItem
          key={params.row.id + 'VNC'}
          icon={
            <Tooltip title="VNC" placement="top-start">
              <CastConnectedIcon
                onClick={() => {
                  navigate(`${URL.vnc}/${id}`);
                }}
              />
            </Tooltip>
          }
          label="VNC"
        />,
        <GridActionsCellItem
          key={params.row.id + 'SSH'}
          icon={
            <Tooltip title="SSH" placement="top-start">
              <DvrIcon
                onClick={() => {
                  navigate(`${URL.webSSH}/${id}`);
                }}
                color="primary"
              />
            </Tooltip>
          }
          label="SSH"
        />,
        <GridActionsCellItem
          key={params.row.id + 'Edit'}
          icon={
            <Tooltip title="编辑" placement="top-start">
              <EditIcon
                color="secondary"
                onClick={() => {
                  setTlc(
                    tagList?.map((e) => ({ ...e, checked: !!params.row.tags?.find((item) => item.name === e.name) }))
                  );
                  setHostId(id);
                  setHostInfo(params.row);
                  openEdit({ type: 'title', payload: '编辑主机信息' });
                  openEdit({ type: 'open' });
                }}
              />
            </Tooltip>
          }
          label="编辑"
        />,
        <GridActionsCellItem
          key={params.row.id + 'Delete'}
          icon={
            <Tooltip title="删除" placement="top-start">
              <DeleteForeverIcon
                color="error"
                onClick={() => {
                  openDelete({ type: 'open' });
                  openDelete({ type: 'text', payload: `确认要删除主机：${name} 吗？` });
                  openDelete({ type: 'title', payload: '删除主机信息' });
                  openDelete({ type: 'todo', payload: () => toDelete(id, name) });
                }}
              />
            </Tooltip>
          }
          label="删除"
        />
      ];
    }
  }
];

type tDP = {
  initGroup: ActionCreator<any>;
  initTag: ActionCreator<any>;
  upHostList: ActionCreator<any>;
};

// eslint-disable-next-line @typescript-eslint/ban-types
type tOP = {};

type tSP = tOP & {
  hostList: HostInfo[];
  groupList: GroupInfo[];
  hostTotal: number;
  tagList: TagInfo[];
  privateKeyList: PrivateKeyInfo[];
};

const mapStateToProps = (state: IState, props: tOP): tSP => ({
  ...props,
  hostList: state.hostList,
  hostTotal: state.hostTotal,
  groupList: state.groupList,
  tagList: state.tagList,
  privateKeyList: state.privateKeyList
});
const mapDispatch: tDP = {
  initGroup: actions.initGroupInfo,
  initTag: actions.initTagInfo,
  upHostList: actions.getHostList
};

type tProps = tSP &
  tDP & {
    tipDispatch: Dispatch<any>;
    formDispatch: Dispatch<any>;
    setHostId: Dispatch<SetStateAction<number>>;
    setHostInfo: Dispatch<SetStateAction<HostInfo>>;
    setTlc: Dispatch<SetStateAction<Array<TagInfo & { checked: boolean }>>>;
  };

function HostInfoTable(props: tProps) {
  const { hostList, hostTotal, upHostList, tipDispatch, formDispatch, setHostId, setHostInfo, setTlc, tagList } = props;
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [pageSize, setPageSize] = useState(25);

  useEffect(() => {
    upHostList({ pageSize, pageNo: 1 });
  }, []);

  const onPageSizeChange = (pageSize: number) => {
    setPageSize(pageSize);
    upHostList({ pageSize, pageNo: 1 });
  };

  const onPageChange = (pageNo: number) => {
    upHostList({ pageSize, pageNo: pageNo + 1 }); // 组件库是以0开始的所以要加一
  };
  const getHostList = (hostList: HostInfo[]) => {
    return hostList?.map((h) => {
      return {
        ...h,
        actions: {
          navigate,
          setTlc,
          tagList,
          openEdit: formDispatch,
          setHostId,
          setHostInfo,
          openDelete: tipDispatch,
          toDelete: async (id, name) => {
            const res = (await deleteHostApi(id)) as HTTPResult;
            if (res.code !== '200') {
              enqueueSnackbar(`主机${name}删除失败: ${res.msg}`, {
                autoHideDuration: 3000,
                variant: 'error'
              });
              return;
            }
            upHostList();
            enqueueSnackbar(`主机: ${name} 已被删除`, {
              autoHideDuration: 3000,
              variant: 'success'
            });
          }
        }
      };
    });
  };

  return (
    <Card style={{ width: '98%', height: '80vh', margin: '0 auto', marginTop: '20px' }}>
      <OmsTable
        columns={columns}
        rows={getHostList(hostList)}
        rowCount={hostTotal}
        pagination
        pageSize={pageSize}
        rowsPerPageOptions={[25, 50, 100]}
        paginationMode={'server'}
        onPageSizeChange={onPageSizeChange}
        onPageChange={onPageChange}
      />
    </Card>
  );
}

// export default HostInfoTable;

export default connect(
  mapStateToProps, // 把仓库的状态映射为组件的属性对象
  mapDispatch
)(HostInfoTable);
