import { HostAction, IState } from './interface';
import {
  groupActions,
  hostActions,
  tagActions,
  tunnelActions,
  jobActions,
  privateKeyActions,
  playerActions,
  quickCommandActions,
  INIT_APP_VERSION
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
  appVersion: 'v0.0',
  hostList: [],
  hostTotal: 0,
  groupList: [],
  tagList: [],
  tunnelList: [],
  jobList: [],
  privateKeyList: [],
  playerList: [],
  quickCommandList: []
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
    case hostActions.UPDATE_HOST_TOTAL: {
      return {
        ...state,
        hostTotal: action.value
      };
    }
    case groupActions.INIT: {
      return {
        ...state,
        groupList: action.value
      };
    }
    case tagActions.INIT: {
      return {
        ...state,
        tagList: action.value
      };
    }
    case tunnelActions.INIT: {
      return {
        ...state,
        tunnelList: action.value
      };
    }
    case jobActions.INIT: {
      return {
        ...state,
        jobList: action.value
      };
    }
    case privateKeyActions.INIT: {
      return {
        ...state,
        privateKeyList: action.value
      };
    }
    case playerActions.INIT: {
      return {
        ...state,
        playerList: action.value
      };
    }
    case quickCommandActions.INIT: {
      return {
        ...state,
        quickCommandList: action.value
      };
    }
    case INIT_APP_VERSION: {
      return {
        ...state,
        appVersion: action.value
      };
    }
    default:
      return state;
  }
};

export default reducer;
