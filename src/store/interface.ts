// import { hostInfo } from '../views/Home/typings';

export interface HostAction {
  type: string;
  value: any;
}

export interface IState {
  hostList: HostInfo[];
  groupList: GroupInfo[];
  tagList: TagInfo[];
  tunnelList: TunnelInfo[];
  jobList: JobInfo[];
}

export interface HostInfo {
  id: number,
  name: string,
  status: boolean,
  user: string,
  password: string,
  addr: string,
  port: number,
  group: GroupInfo,
  private_key_id: number,
  tags: TagInfo[] | [],
  tunnels: TunnelInfo[] | [],
  jobs: JobInfo[] | [],

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

export interface TunnelInfo {
  id: number,
  mode: 'local' | 'remote',
  source: string,
  destination: string,
  status: boolean,
  error_msg: string,
  host_id: number,
}

export interface JobInfo {
  id: number,
  name: string,
  type: 'cron' | 'task',
  spec: string,
  cmd: string,
  status: string,
  host_id: number,
}
