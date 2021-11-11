import * as actionType from './action-types';
import { GroupInfo, HostInfo, JobInfo, TagInfo, TunnelInfo } from './interface';

const actions = {
  initHostInfo(value:HostInfo[]) {
    return { type: actionType.WILL_INIT_HOST, value };
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
  deleteGroupInfo(value: GroupInfo) {
    return { type: actionType.WILL_DELETE_GROUP, value };
  },
  addGroupInfo(value: string) {
    return { type: actionType.WILL_ADD_GROUP, value };
  },
  editGroupInfo(value: GroupInfo) {
    return { type: actionType.WILL_EDIT_GROUP, value };
  },
  deleteTagInfo(value: string) {
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
  }
};

export default actions;
