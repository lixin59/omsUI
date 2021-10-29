import { HostAction } from './interface';
import { hostActions } from './action-types';
import { hostInfo } from '../views/Home/typings';

const data: hostInfo[] = [
  {
    id: 1,
    hostName: '127',
    status: false,
    user: 'xm',
    host: '127.0.0.1',
    port: '22',
    group: '组1',
    tag: '',
  },
  {
    id: 2,
    hostName: '127',
    status: true,
    user: 'xm',
    host: '127.0.0.1',
    port: '22',
    group: '组2',
    tag: '',
  },
  {
    id: 3,
    hostName: '127',
    status: false,
    user: 'xm',
    host: '127.0.0.1',
    port: '22',
    group: '组1',
    tag: '',
  },
  // {
  //   id: 4,
  //   hostName: '127',
  //   status: false,
  //   user: 'xm',
  //   host: '127.0.0.1',
  //   port: '22',
  //   group: '组1',
  //   tag: '',
  // },
  // {
  //   id: 5,
  //   hostName: '127',
  //   status: false,
  //   user: 'xm',
  //   host: '127.0.0.1',
  //   port: '22',
  //   group: '组1',
  //   tag: '',
  // },
  // {
  //   id: 6,
  //   hostName: '127',
  //   status: false,
  //   user: 'xm',
  //   host: '127.0.0.1',
  //   port: '22',
  //   group: '组1',
  //   tag: '',
  // },
  // {
  //   id: 7,
  //   hostName: '127',
  //   status: false,
  //   user: 'xm',
  //   host: '127.0.0.1',
  //   port: '22',
  //   group: '组1',
  //   tag: '',
  // },
  // {
  //   id: 8,
  //   hostName: '127',
  //   status: false,
  //   user: 'xm',
  //   host: '127.0.0.1',
  //   port: '22',
  //   group: '组1',
  //   tag: '',
  // },
  // {
  //   id: 9,
  //   hostName: '127',
  //   status: false,
  //   user: 'xm',
  //   host: '127.0.0.1',
  //   port: '22',
  //   group: '组1',
  //   tag: '',
  // },
  // {
  //   id: 10,
  //   hostName: '127',
  //   status: false,
  //   user: 'xm',
  //   host: '127.0.0.1',
  //   port: '22',
  //   group: '组1',
  //   tag: '',
  // },
  // {
  //   id: 11,
  //   hostName: '127',
  //   status: false,
  //   user: 'xm',
  //   host: '127.0.0.1',
  //   port: '22',
  //   group: '组1',
  //   tag: '',
  // },
  // {
  //   id: 12,
  //   hostName: '127',
  //   status: false,
  //   user: 'xm',
  //   host: '127.0.0.1',
  //   port: '22',
  //   group: '组1',
  //   tag: '',
  // },
  // {
  //   id: 13,
  //   hostName: '127',
  //   status: false,
  //   user: 'xm',
  //   host: '127.0.0.1',
  //   port: '22',
  //   group: '组1',
  //   tag: '',
  // },

];
// 初始化state数据
const initialState ={
  data,
};

// 状态处理函数
const reducer = (state = initialState, action: HostAction): {data: hostInfo[]} => {
  switch (action.type) {
    case hostActions.DELETE_HOST_INFO: {
      const newdata = {
        data: state.data.filter((item: hostInfo)=> item.id !== action.value),
      };
      return newdata;
    }
    case hostActions.ADD_HOST_INFO: {
      const newdata = {
        data: [...state.data, action.value],
      };
      return newdata;
    }
    default:
      return state;
  }
};

export default reducer;
