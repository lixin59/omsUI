export const WILL_INIT_HOST = 'WILL_INIT_HOST';
export const WILL_DELETE = 'WILL_DELETE';
export const WILL_ADD = 'WILL_ADD';// 更新数据
export const WILL_EDIT_HOST = 'WILL_EDIT_HOST'; // 编辑主机信息

export const WILL_DELETE_GROUP = 'WILL_DELETE_GROUP';
export const WILL_ADD_GROUP = 'WILL_ADD_GROUP';// 更新数据
export const WILL_EDIT_GROUP = 'WILL_EDIT_GROUP'; // 编辑分组信息

export const WILL_DELETE_TAG = 'WILL_DELETE_TAG';
export const WILL_ADD_TAG = 'WILL_ADD_TAG';// 更新数据
export const WILL_EDIT_TAG = 'WILL_EDIT_TAG'; // 编辑标签信息

export const WILL_DELETE_Tunnel = 'WILL_DELETE_Tunnel';
export const WILL_ADD_Tunnel = 'WILL_ADD_Tunnel';// 更新数据
export const WILL_EDIT_Tunnel = 'WILL_EDIT_Tunnel'; // 编辑标签信息

export const WILL_DELETE_Job = 'WILL_DELETE_Job';
export const WILL_ADD_Job = 'WILL_ADD_Job';// 更新数据
export const WILL_EDIT_Job = 'WILL_EDIT_Job'; // 编辑标签信息

export enum hostActions{
  INIT = 'INIT_HOST_INFO',
  DELETE_HOST_INFO = 'DELETE_HOST_INFO',
  ADD_HOST_INFO = 'ADD_HOST_INFO',
  EDIT_HOST_INFO = 'EDIT_HOST_INFO',
}

export enum groupActions{
  INIT = 'INIT_GROUP_INFO',
  DELETE_GROUP_INFO = 'DELETE_GROUP_INFO',
  ADD_GROUP_INFO = 'ADD_GROUP_INFO',
  EDIT_GROUP_INFO = 'EDIT_GROUP_INFO',
}

export enum tagActions{
  INIT = 'INIT_TAG_INFO',
  DELETE_TAG_INFO = 'DELETE_TAG_INFO',
  ADD_TAG_INFO = 'ADD_TAG_INFO',
  EDIT_TAG_INFO = 'EDIT_TAG_INFO',
}

export enum tunnelActions{
  INIT = 'INIT_JOB_TUNNEL_INFO',
  DELETE = 'DELETE_TUNNEL_INFO',
  ADD = 'ADD_TUNNEL_INFO',
  EDIT = 'EDIT_TUNNELINFO',
}

export enum jobActions{
  INIT = 'INIT_JOB_INFO',
  DELETE = 'DELETE_JOB_INFO',
  ADD = 'ADD_JOB_INFO',
  EDIT = 'EDIT_JOB_INFO',
}
