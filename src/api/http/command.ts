import { HTTPResult } from './httpRequestApi';
import { deleteApi, getApi, postApi, putApi } from './api';
import { commandUrl } from './requestUrl';
import { QuickCommandInfo } from '../../store/interface';

// 获取执行命令历史记录
export const getCMDListApi = (keyword: string, limit = 20): Promise<HTTPResult> => {
  const parameters = { keyword, limit };
  return getApi(commandUrl.getHistory, parameters);
};

// 获取所有快捷指令
export const getQuickCommandList = (): Promise<HTTPResult> => {
  return getApi(commandUrl.quick_command);
};

export type tQuickCommandReq = {
  name: string;
  cmd: string;
  append_cr: boolean;
};
// 增加快捷指令
export const addQuickCommand = (data: tQuickCommandReq): Promise<HTTPResult> => {
  const formData = new FormData();
  for (const k in data) {
    // eslint-disable-next-line no-prototype-builtins
    if (data.hasOwnProperty(k)) {
      formData.append(k, data[k]);
    }
  }
  return postApi(commandUrl.quick_command, formData);
};

// 删除快捷指令
export const deleteQuickCommand = (id: number): Promise<HTTPResult> => {
  return deleteApi(`${commandUrl.quick_command}/${id}`);
};

// 修改快捷指令
export const editQuickCommand = (data: QuickCommandInfo): Promise<HTTPResult> => {
  const formData = new FormData();
  for (const k in data) {
    // eslint-disable-next-line no-prototype-builtins
    if (data.hasOwnProperty(k)) {
      formData.append(k, data[k]);
    }
  }
  return putApi(commandUrl.quick_command, formData);
};
