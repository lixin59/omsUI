import { postApi, putApi } from './api';
import { urlType } from './requestUrl';
import { AxiosRequestConfig } from 'axios';
import { HTTPResult } from './httpRequestApi';

interface ImportAssets {
  files: any;
}

// 导入资产文件
export const importAssetsFileApi = (data: ImportAssets, config?: AxiosRequestConfig): Promise<HTTPResult> => {
  const { files } = data;
  const formData = new FormData();
  for (const k in files) {
    // eslint-disable-next-line no-prototype-builtins
    if (files.hasOwnProperty(k)) {
      formData.append('files', files[k]);
    }
  }
  return postApi(`${urlType.tools.import}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 86400000, // 一天
    ...config
  });
};
