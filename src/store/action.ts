import * as actionType from './action-types';
import { GroupInfo, HostInfo, JobInfo, PlayerInfo, PrivateKeyInfo, TagInfo, TunnelInfo } from './interface';

const actions = {
  getHostList() {
    return { type: actionType.WILL_GET_HOST_LIST };
  },
  initHostInfo(value: HostInfo[]) {
    return { type: actionType.WILL_INIT_HOST, value };
  },
  initGroupInfo(value: GroupInfo[]) {
    return { type: actionType.groupActions.INIT, value };
  },
  initTagInfo(value: TagInfo[]) {
    return { type: actionType.tagActions.INIT, value };
  },
  initJobInfo(value: JobInfo[]) {
    return { type: actionType.jobActions.INIT, value };
  },
  initTunnelInfo(value: TunnelInfo[]) {
    return { type: actionType.tunnelActions.INIT, value };
  },
  initPrivateKeyInfo(value: PrivateKeyInfo[]) {
    return { type: actionType.privateKeyActions.INIT, value };
  },
  addPrivateKeyInfo(value: PrivateKeyInfo) {
    return { type: actionType.privateKeyActions.ADD, value };
  },
  deletePrivateKeyInfo(value: number) {
    return { type: actionType.privateKeyActions.DELETE, value };
  },
  editPrivateKeyInfo(value: PrivateKeyInfo) {
    return { type: actionType.privateKeyActions.EDIT, value };
  },
  deleteHostInfo(value: number) {
    return { type: actionType.WILL_DELETE, value };
  },
  addHostInfo(value: HostInfo) {
    return { type: actionType.WILL_ADD, value };
  },
  editHostInfo(value: HostInfo) {
    return { type: actionType.WILL_EDIT_HOST, value };
  },
  deleteGroupInfo(value: number) {
    return { type: actionType.WILL_DELETE_GROUP, value };
  },
  addGroupInfo(value: GroupInfo) {
    return { type: actionType.WILL_ADD_GROUP, value };
  },
  editGroupInfo(value: GroupInfo) {
    return { type: actionType.WILL_EDIT_GROUP, value };
  },
  deleteTagInfo(value: number) {
    return { type: actionType.WILL_DELETE_TAG, value };
  },
  addTagInfo(value: TagInfo) {
    return { type: actionType.WILL_ADD_TAG, value };
  },
  editTagInfo(value: TagInfo) {
    return { type: actionType.WILL_EDIT_TAG, value };
  },
  deleteTunnelInfo(value: number) {
    return { type: actionType.WILL_DELETE_Tunnel, value };
  },
  addTunnelInfo(value: TunnelInfo) {
    return { type: actionType.WILL_ADD_Tunnel, value };
  },
  editTunnelInfo(value: TunnelInfo) {
    return { type: actionType.WILL_EDIT_Tunnel, value };
  },
  addJobInfo(value: JobInfo) {
    return { type: actionType.WILL_ADD_Job, value };
  },
  deleteJobInfo(value: string) {
    return { type: actionType.WILL_DELETE_Job, value };
  },
  editJobInfo(value: JobInfo) {
    return { type: actionType.WILL_EDIT_Job, value };
  },
  initPlayerInfo() {
    return { type: actionType.WILL_INIT_PLAYER };
  }
};

export default actions;
