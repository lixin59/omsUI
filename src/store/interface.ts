import { hostInfo } from '../views/Home/typings';

export interface HostAction {
  type: string;
  value: any;
}

export interface IState {
  data: hostInfo[]
}
