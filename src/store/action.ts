import * as actionType from './action-types';
import { GroupInfo, HostInfo, JobInfo, PrivateKeyInfo, TagInfo, TunnelInfo } from './interface';
import { WILL_INIT_APP_VERSION, WILL_INIT_QUICK_COMMAND } from './action-types';

const actions = {
  getHostList(value?: { pageSize: number; pageNo: number }) {
    return { type: actionType.WILL_GET_HOST_LIST, value };
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
    return { type: actionType.WILL_INIT_JOB };
  },
  updateTunnelList() {
    return { type: actionType.WILL_INIT_TUNNEL };
  },
  initPlayerInfo() {
    return { type: actionType.WILL_INIT_PLAYER };
  },
  initQuickCommandList() {
    return { type: actionType.WILL_INIT_QUICK_COMMAND };
  },
  initAppVersion() {
    return { type: WILL_INIT_APP_VERSION };
  }
};

export default actions;
