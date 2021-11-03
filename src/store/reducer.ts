import { GroupInfo, HostAction, TagInfo, HostInfo } from './interface';
import { groupActions, hostActions, tagActions } from './action-types';
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

// 初始化state数据
const initialState = {
  hostList,
  groupList,
  tagList
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
    default:
      return state;
  }
};

export default reducer;
