import * as actionType from './action-types';
import {hostInfo} from "../views/Home/typings";
import {GroupInfo, TagInfo} from "./interface";

const actions = {
  deleteHostInfo(value: number) {
    return { type: actionType.WILL_DELETE, value };
  },
  addHostInfo(value: hostInfo) {
    return { type: actionType.WILL_ADD, value };
  },
  editHostInfo(value: hostInfo) {
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
  deleteTagInfo(value: TagInfo) {
    return { type: actionType.WILL_DELETE_TAG, value };
  },
  addTagInfo(value: string) {
    return { type: actionType.WILL_ADD_TAG, value };
  },
  editTagInfo(value: TagInfo) {
    return { type: actionType.WILL_EDIT_TAG, value };
  },
};

export default actions;
