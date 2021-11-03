// import { hostInfo } from '../views/Home/typings';

export interface HostAction {
  type: string;
  value: any;
}

export interface IState {
  hostList: HostInfo[];
  groupList: GroupInfo[];
  tagList: TagInfo[];
}

export interface HostInfo {
  id: number;
  name: string;
  status: boolean;
  user: string;
  password: string;
  host: string;
  port: string;
  group: GroupInfo;
  tag: TagInfo[] | [];
}

export interface GroupInfo {
  id: number;
  name: string;
  mode: number;
  rule: string;
}

export interface TagInfo {
  id: number;
  name: string;
}
