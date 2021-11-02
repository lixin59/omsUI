import { getApi, postApi } from './api';
import { urlType } from './config';

export const getAllHostInfo = (data: any = {}) => {
  return getApi(urlType.getAllHost, data, {});
};
