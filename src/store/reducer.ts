import {
  GroupInfo,
  HostAction,
  TagInfo,
  HostInfo,
  TunnelInfo,
  JobInfo,
  IState,
  PrivateKeyInfo,
  PlayerInfo
} from './interface';
import {
  groupActions,
  hostActions,
  tagActions,
  tunnelActions,
  jobActions,
  privateKeyActions,
  playerActions
} from './action-types';
// import { getGroupsApi, getJobsApi, getTagsApi, getTunnelsApi, HTTPResult } from '../api/http/httpRequestApi';
// import { hostInfo } from '../views/Home/typings';

// const groupList: GroupInfo[] = [
//   {
//     id: 1,
//     name: '分组1',
//     mode: 0,
//     rule: ''
//   },
//   {
//     id: 2,
//     name: '分组2',
//     mode: 1,
//     rule: '121212121'
//   }
// ];

// const tagList: TagInfo[] = [
//   {
//     id: 1,
//     name: '标签1'
//   },
//   {
//     id: 2,
//     name: '标签2'
//   }
// ];

// const tunnelList: TunnelInfo[] = [
//   {
//     id: 1,
//     mode: 'local',
//     source: '12121',
//     destination: '111',
//     status: true,
//     error_msg: 'msg',
//     host_id: 1
//   }, {
//     id: 4,
//     mode: 'remote',
//     source: '12121e',
//     destination: '1121',
//     status: false,
//     error_msg: 'msg',
//     host_id: 2
//   }];
//
// const jobList: JobInfo[] = [
//   {
//     id: 1,
//     name: 'job1',
//     type: 'cron',
//     spec: '*/1 * * * *',
//     cmd: 'ls -l',
//     status: 'fff',
//     host_id: 1
//   }, {
//     id: 2,
//     name: 'job2',
//     type: 'task',
//     spec: '*/1 * * * *',
//     cmd: 'ls',
//     status: 'sss',
//     host_id: 2
//   }
// ];

// const hostList: HostInfo[] = [
//   {
//     id: 1,
//     name: '1271',
//     status: false,
//     user: 'xm',
//     password: '1221',
//     addr: '127.0.0.1',
//     port: '22',
//     private_key_id: 0,
//     group: {
//       id: 1,
//       name: '分组1',
//       mode: 0,
//       rule: ''
//     },
//     tags: [{
//       id: 1,
//       name: '标签1'
//     }],
//     tunnels: tunnelList,
//     jobs: jobList
//   },
//   {
//     id: 2,
//     name: '1272',
//     status: true,
//     user: 'xm',
//     password: '1221',
//     addr: '127.0.0.1',
//     private_key_id: 0,
//     port: '22',
//     group: {
//       id: 1,
//       name: '分组1',
//       mode: 0,
//       rule: ''
//     },
//     tags: [{
//       id: 1,
//       name: '标签1'
//     }],
//     tunnels: tunnelList,
//     jobs: jobList
//   },
//   {
//     id: 3,
//     name: '1273',
//     status: false,
//     user: 'xm',
//     password: '1221',
//     addr: '127.0.0.1',
//     private_key_id: 0,
//     port: '22',
//     group: {
//       id: 2,
//       name: '分组2',
//       mode: 1,
//       rule: '121212121'
//     },
//     tags: [{
//       id: 2,
//       name: '标签2'
//     }],
//     tunnels: tunnelList,
//     jobs: jobList
//
//   }
// ];

// const res = (await getGroupsApi()) as HTTPResult; // ES 2021 新特性: Top-level await
// const rest = (await getTagsApi()) as HTTPResult;
// const job = (await getJobsApi()) as HTTPResult;
// const tunnel = (await getTunnelsApi()) as HTTPResult;

// 初始化state数据
const initialState: IState = {
  hostList: [],
  groupList: [],
  tagList: [],
  tunnelList: [],
  jobList: [],
  privateKeyList: [],
  playerList: []
  // groupList: res.data || [],
  // tagList: rest.data || [],
  // tunnelList: tunnel.data || [],
  // jobList: job.data || []
};

// 状态处理函数
const reducer = (state = initialState, action: HostAction) => {
  switch (action.type) {
    case hostActions.INIT: {
      return {
        ...state,
        hostList: action.value
      };
    }
    case hostActions.DELETE_HOST_INFO: {
      return {
        ...state,
        hostList: state.hostList.filter((item: HostInfo) => item.id !== action.value)
      };
    }
    case hostActions.ADD_HOST_INFO: {
      return {
        ...state,
        hostList: [...state.hostList, action.value]
      };
    }
    case hostActions.EDIT_HOST_INFO: {
      state.hostList.forEach((e: HostInfo, i, arr: HostInfo[]) => {
        if (e.id === action.value.id) {
          arr[i] = action.value;
        }
      });
      return {
        ...state,
        hostList: [...state.hostList]
      };
    }
    case groupActions.INIT: {
      return {
        ...state,
        groupList: action.value
      };
    }
    case groupActions.DELETE_GROUP_INFO: {
      return {
        ...state,
        groupList: state.groupList.filter((item: GroupInfo) => item.id !== action.value)
      };
    }
    case groupActions.ADD_GROUP_INFO: {
      return {
        ...state,
        groupList: [...state.groupList, action.value]
      };
    }
    case groupActions.EDIT_GROUP_INFO: {
      state.groupList.forEach((e: GroupInfo, i: number, arr: GroupInfo[]) => {
        if (e.id === action.value.id) {
          arr[i] = action.value;
        }
      });
      return {
        ...state,
        groupList: [...state.groupList]
      };
    }
    case tagActions.INIT: {
      return {
        ...state,
        tagList: action.value
      };
    }
    case tagActions.DELETE_TAG_INFO: {
      return {
        ...state,
        tagList: state.tagList.filter((item: TagInfo) => item.id !== action.value)
      };
    }
    case tagActions.ADD_TAG_INFO: {
      return {
        ...state,
        tagList: [...state.tagList, action.value]
      };
    }
    case tagActions.EDIT_TAG_INFO: {
      state.tagList.forEach((e: TagInfo, i: number, arr: TagInfo[]) => {
        if (e.id === action.value.id) {
          arr[i] = action.value;
        }
      });
      return {
        ...state,
        tagList: [...state.tagList]
      };
    }
    case tunnelActions.INIT: {
      return {
        ...state,
        tunnelList: action.value
      };
    }
    case tunnelActions.DELETE: {
      return {
        ...state,
        tunnelList: state.tunnelList.filter((item: TunnelInfo) => item.id !== action.value)
      };
    }
    case tunnelActions.ADD: {
      return {
        ...state,
        tunnelList: [...state.tunnelList, action.value]
      };
    }
    case tunnelActions.EDIT: {
      state.tunnelList.forEach((e: TunnelInfo, i: number, arr: TunnelInfo[]) => {
        if (e.id === action.value.id) {
          arr[i] = action.value;
        }
      });
      return {
        ...state,
        tunnelList: [...state.tunnelList]
      };
    }
    case jobActions.INIT: {
      return {
        ...state,
        jobList: action.value
      };
    }
    case jobActions.DELETE: {
      return {
        ...state,
        jobList: state.jobList.filter((item: JobInfo) => item.id !== action.value)
      };
    }
    case jobActions.ADD: {
      return {
        ...state,
        jobList: [...state.jobList, action.value]
      };
    }
    case jobActions.EDIT: {
      state.jobList.forEach((e: JobInfo, i: number, arr: JobInfo[]) => {
        if (e.id === action.value.id) {
          arr[i] = action.value;
        }
      });
      return {
        ...state,
        jobList: [...state.jobList]
      };
    }
    case privateKeyActions.INIT: {
      return {
        ...state,
        privateKeyList: action.value
      };
    }
    case privateKeyActions.DELETE: {
      return {
        ...state,
        privateKeyList: state.privateKeyList.filter((item: PrivateKeyInfo) => item.id !== action.value)
      };
    }
    case privateKeyActions.ADD: {
      return {
        ...state,
        privateKeyList: [...state.privateKeyList, action.value]
      };
    }
    case privateKeyActions.EDIT: {
      state.privateKeyList.forEach((e: PrivateKeyInfo, i: number, arr: PrivateKeyInfo[]) => {
        if (e.id === action.value.id) {
          arr[i] = action.value;
        }
      });
      return {
        ...state,
        privateKeyList: [...state.privateKeyList]
      };
    }
    case playerActions.INIT: {
      return {
        ...state,
        playerList: action.value
      };
    }
    default:
      return state;
  }
};

export default reducer;
