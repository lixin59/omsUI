import * as actionType from './action-types';
import { GroupInfo, HostInfo, JobInfo, PrivateKeyInfo, TagInfo, TunnelInfo } from './interface';
import { WILL_INIT_GROUP, WILL_INIT_TAG } from './action-types';

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
  updateGroupList() {
    return { type: actionType.WILL_INIT_GROUP };
  },
  updateTagList() {
    return { type: actionType.WILL_INIT_TAG };
  },
  updateJobList() {
    return { type: actionType.WILL_INIT_Job };
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
  initPlayerInfo() {
    return { type: actionType.WILL_INIT_PLAYER };
  }
};

export default actions;
