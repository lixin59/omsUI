// import { hostInfo } from '../views/Home/typings';

export interface HostAction {
  type: string;
  value: any;
}

export interface IState {
  appVersion: string;
  hostList: HostInfo[];
  hostTotal: number;
  groupList: GroupInfo[];
  tagList: TagInfo[];
  tunnelList: TunnelInfo[];
  jobList: JobInfo[];
  privateKeyList: PrivateKeyInfo[];
  playerList: PlayerInfo[];
  quickCommandList: QuickCommandInfo[];
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
  jobs?: JobInfo[];
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
  cmd_type: 'cmd' | 'player';
  cmd_id: number;
  execute_type: 'host' | 'group' | 'tag';
  execute_id: number;
}

export interface PrivateKeyInfo {
  id: number;
  name: string;
  passphrase?: string;
  key_file?: any;
}

type tStepType = 'cmd' | 'shell' | 'file'; // 插件类型

type tStep = { name: string; type: tStepType; seq: number; params: string };

export interface PlayerInfo {
  id: number;
  name: string;
  steps: tStep[];
}

export interface QuickCommandInfo {
  id: number;
  name: string;
  cmd: string;
  append_cr: boolean; // 是否追加CR
}
