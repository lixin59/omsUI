import { getApi, postApi } from './api';
import { urlType } from './requestUrl';

export const getAllHostInfo = (data: any = {}) => {
  return getApi(urlType.getAllHost, data, {});
};
