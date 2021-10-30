import { hostInfo } from '../views/Home/typings';

export interface HostAction {
  type: string;
  value: any;
}

export interface IState {
  hostList: hostInfo[];
  groupList: GroupInfo[];
  tagList: TagInfo[];
}

export interface GroupInfo {
  name: string;
  pattern: string;
  rule: string;
}

export interface TagInfo {
  name: string;
}
