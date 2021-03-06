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
  privateKeyList: PrivateKeyInfo[];
}

export interface HostInfo {
  id: number;
  name: string;
  status: boolean;
  user: string;
  password: string;
  addr: string;
  port: number;
  vnc_port: number;
  group: GroupInfo;
  private_key_id: number;
  tags: TagInfo[];
  tunnels: TunnelInfo[];
  jobs: JobInfo[];
  keyFile?: any;
}

export interface GroupInfo {
  id: number;
  name: string;
  mode: 0 | 1;
  params: string;
}

export interface TagInfo {
  id: number;
  name: string;
}

export interface TunnelInfo {
  id: number;
  mode: 'local' | 'remote';
  source: string;
  destination: string;
  status: number;
  error_msg: string;
  host_id: number;
}

export interface JobInfo {
  id: number;
  name: string;
  type: 'cron' | 'task';
  spec: string;
  cmd: string;
  status: string;
  host_id: number;
}

export interface PrivateKeyInfo {
  id: number;
  name: string;
  passphrase?: string;
  key_file?: any;
}
