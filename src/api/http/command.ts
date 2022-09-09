import { HTTPResult } from './httpRequestApi';
import { getApi } from './api';
import { commandUrl } from './requestUrl';

// 获取执行命令历史记录
export const getCMDListApi = (keyword: string, limit = 20): Promise<HTTPResult> => {
  const parameters = { keyword, limit };
  return getApi(commandUrl.getHistory, parameters);
};
