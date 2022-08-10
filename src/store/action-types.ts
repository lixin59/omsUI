export const WILL_INIT_HOST = 'WILL_INIT_HOST';
export const WILL_GET_HOST_LIST = 'WILL_GET_HOST_LIST';
export const WILL_DELETE = 'WILL_DELETE';
export const WILL_ADD = 'WILL_ADD'; // 更新数据
export const WILL_EDIT_HOST = 'WILL_EDIT_HOST'; // 编辑主机信息

export const WILL_INIT_GROUP = 'WILL_INIT_GROUP';
export const WILL_DELETE_GROUP = 'WILL_DELETE_GROUP';
export const WILL_ADD_GROUP = 'WILL_ADD_GROUP'; // 更新数据
export const WILL_EDIT_GROUP = 'WILL_EDIT_GROUP'; // 编辑分组信息

export const WILL_INIT_TAG = 'WILL_INIT_TAG';
export const WILL_DELETE_TAG = 'WILL_DELETE_TAG';
export const WILL_ADD_TAG = 'WILL_ADD_TAG'; // 更新数据
export const WILL_EDIT_TAG = 'WILL_EDIT_TAG'; // 编辑标签信息

export const WILL_INIT_Tunnel = 'WILL_INIT_Tunnel';
// export const WILL_DELETE_Tunnel = 'WILL_DELETE_Tunnel';
// export const WILL_ADD_Tunnel = 'WILL_ADD_Tunnel';
// export const WILL_EDIT_Tunnel = 'WILL_EDIT_Tunnel';

export const WILL_INIT_Job = 'WILL_INIT_Job';
export const WILL_DELETE_Job = 'WILL_DELETE_Job';
export const WILL_ADD_Job = 'WILL_ADD_Job'; // 更新数据
export const WILL_EDIT_Job = 'WILL_EDIT_Job'; // 编辑标签信息

export const WILL_DELETE_PLAYER = 'WILL_DELETE_PLAYER';
export const WILL_ADD_PLAYER = 'WILL_ADD_PLAYER';
export const WILL_EDIT_PLAYER = 'WILL_EDIT_PLAYER';
export const WILL_INIT_PLAYER = 'WILL_INIT_PLAYER';

export enum hostActions {
  INIT = 'INIT_HOST_INFO',
  DELETE_HOST_INFO = 'DELETE_HOST_INFO',
  ADD_HOST_INFO = 'ADD_HOST_INFO',
  EDIT_HOST_INFO = 'EDIT_HOST_INFO'
}

export enum groupActions {
  INIT = 'INIT_GROUP_INFO',
  DELETE_GROUP_INFO = 'DELETE_GROUP_INFO',
  ADD_GROUP_INFO = 'ADD_GROUP_INFO',
  EDIT_GROUP_INFO = 'EDIT_GROUP_INFO'
}

export enum tagActions {
  INIT = 'INIT_TAG_INFO',
  DELETE_TAG_INFO = 'DELETE_TAG_INFO',
  ADD_TAG_INFO = 'ADD_TAG_INFO',
  EDIT_TAG_INFO = 'EDIT_TAG_INFO'
}

export enum tunnelActions {
  INIT = 'INIT_JOB_TUNNEL_INFO',
  DELETE = 'DELETE_TUNNEL_INFO',
  ADD = 'ADD_TUNNEL_INFO',
  EDIT = 'EDIT_TUNNELINFO'
}

export enum jobActions {
  INIT = 'INIT_JOB_INFO',
  DELETE = 'DELETE_JOB_INFO',
  ADD = 'ADD_JOB_INFO',
  EDIT = 'EDIT_JOB_INFO'
}

export enum privateKeyActions {
  INIT = 'INIT_PRIVATE_KEY_INFO',
  DELETE = 'DELETE_PRIVATE_KEY_INFO',
  ADD = 'ADD_PRIVATE_KEY_INFO',
  EDIT = 'EDIT_PRIVATE_KEY_INFO'
}

export enum playerActions {
  INIT = 'INIT_PLAYER_INFO',
  DELETE = 'DELETE_PLAYER_INFO',
  ADD = 'ADD_PLAYER_INFO',
  EDIT = 'EDIT_PLAYER_INFO'
}
