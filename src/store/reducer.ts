import { GroupInfo, HostAction, TagInfo, HostInfo, TunnelInfo, JobInfo } from './interface';
import { groupActions, hostActions, tagActions, tunnelActions, jobActions } from './action-types';
// import { hostInfo } from '../views/Home/typings';

const hostList: HostInfo[] = [
  {
    id: 1,
    name: '1271',
    status: false,
    user: 'xm',
    password: '1221',
    host: '127.0.0.1',
    port: '22',
    group: {
      id: 1,
      name: '分组1',
      mode: 0,
      rule: ''
    },
    tag: [{
      id: 1,
      name: '标签1'
    }]
  },
  {
    id: 2,
    name: '1272',
    status: true,
    user: 'xm',
    password: '1221',
    host: '127.0.0.1',
    port: '22',
    group: {
      id: 1,
      name: '分组1',
      mode: 0,
      rule: ''
    },
    tag: [{
      id: 1,
      name: '标签1'
    }]
  },
  {
    id: 3,
    name: '1273',
    status: false,
    user: 'xm',
    password: '1221',
    host: '127.0.0.1',
    port: '22',
    group: {
      id: 2,
      name: '分组2',
      mode: 1,
      rule: '121212121'
    },
    tag: [{
      id: 2,
      name: '标签2'
    }]
  }
];

const groupList: GroupInfo[] = [
  {
    id: 1,
    name: '分组1',
    mode: 0,
    rule: ''
  },
  {
    id: 2,
    name: '分组2',
    mode: 1,
    rule: '121212121'
  }
];

const tagList: TagInfo[] = [
  {
    id: 1,
    name: '标签1'
  },
  {
    id: 2,
    name: '标签2'
  }
];

const tunnelList: TunnelInfo[] = [
  {
    id: 1,
    mode: 'local',
    source: '12121',
    destination: '111',
    status: true,
    error_msg: 'msg',
    host_id: 1
  }, {
    id: 2,
    mode: 'remote',
    source: '12121e',
    destination: '1121',
    status: false,
    error_msg: 'msg',
    host_id: 2
  }];

const jobList: JobInfo[] = [
  {
    id: 1,
    name: 'job1',
    type: 'cron',
    spec: '*/1 * * * *',
    cmd: 'ls -l',
    status: 'fff',
    host_id: 1
  }, {
    id: 2,
    name: 'job2',
    type: 'task',
    spec: '*/1 * * * *',
    cmd: 'ls',
    status: 'sss',
    host_id: 2
  }
];

// 初始化state数据
const initialState = {
  hostList,
  groupList,
  tagList,
  tunnelList,
  jobList
};

// 状态处理函数
const reducer = (state = initialState, action: HostAction) => {
  switch (action.type) {
    case hostActions.DELETE_HOST_INFO: {
      return ({
        ...state,
        hostList: state.hostList.filter((item: HostInfo) => item.id !== action.value)
      });
    }
    case hostActions.ADD_HOST_INFO: {
      return ({
        ...state,
        hostList: [...state.hostList, action.value]
      });
    }
    case hostActions.EDIT_HOST_INFO: {
      state.hostList.forEach((e, i, arr) => {
        if (e.id === action.value.id) {
          arr[i] = action.value;
        }
      });
      return ({
        ...state,
        hostList: [...state.hostList]
      });
    }
    case groupActions.DELETE_GROUP_INFO: {
      return ({
        ...state,
        groupList: state.groupList.filter((item: GroupInfo) => item.name !== action.value)
      });
    }
    case groupActions.ADD_GROUP_INFO: {
      return ({
        ...state,
        groupList: [...state.groupList, action.value]
      });
    }
    case groupActions.EDIT_GROUP_INFO: {
      state.groupList.forEach((e, i, arr) => {
        if (e.name === action.value.name) {
          arr[i] = action.value;
        }
      });
      return ({
        ...state,
        groupList: [...state.groupList]
      });
    }
    case tagActions.DELETE_TAG_INFO: {
      return ({
        ...state,
        tagList: state.tagList.filter((item: TagInfo) => item.name !== action.value)
      });
    }
    case tagActions.ADD_TAG_INFO: {
      return ({
        ...state,
        tagList: [...state.tagList, action.value]
      });
    }
    case tagActions.EDIT_TAG_INFO: {
      state.tagList.forEach((e, i, arr) => {
        if (e.name === action.value.name) {
          arr[i] = action.value;
        }
      });
      return ({
        ...state,
        tagList: [...state.tagList]
      });
    }
    case tunnelActions.DELETE: {
      return ({
        ...state,
        tunnelList: state.tunnelList.filter((item) => item.id !== action.value)
      });
    }
    case tunnelActions.ADD: {
      return ({
        ...state,
        tunnelList: [...state.tunnelList, action.value]
      });
    }
    case tunnelActions.EDIT: {
      state.tunnelList.forEach((e, i, arr) => {
        if (e.id === action.value.id) {
          arr[i] = action.value;
        }
      });
      return ({
        ...state,
        tunnelList: [...state.tunnelList]
      });
    }
    case jobActions.DELETE: {
      console.log('22222');
      return ({
        ...state,
        jobList: state.jobList.filter((item) => item.name !== action.value)
      });
    }
    case jobActions.ADD: {
      return ({
        ...state,
        jobList: [...state.jobList, action.value]
      });
    }
    case jobActions.EDIT: {
      state.jobList.forEach((e, i, arr) => {
        if (e.id === action.value.id) {
          arr[i] = action.value;
        }
      });
      return ({
        ...state,
        jobList: [...state.jobList]
      });
    }
    default:
      return state;
  }
};

export default reducer;
