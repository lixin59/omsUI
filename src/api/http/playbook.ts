import { postApi, putApi, getApi, deleteApi } from './api';
import { urlType } from './requestUrl';
import { HTTPResult } from './httpRequestApi';
import { AxiosRequestConfig } from 'axios';

type tStepType = 'cmd' | 'shell' | 'file'; // 插件类型

export type tSchemaInfo = {
  type: tStepType;
  schema: {
    required: string[];
    properties: any;
    type: string;
  };
};

interface SchemaResp extends HTTPResult {
  data: tSchemaInfo[];
}

interface UploadStepFileResp extends HTTPResult {
  data: {
    files: Array<{ name: string; size: number; cache_path: string; status: boolean }>;
  };
}

type tStep = { name: string; type: tStepType; seq: number; params: string };

interface Player {
  name: string;
  steps: tStep[];
}

// 获取JSON schema数据
export const getSchemaInfoApi = (): Promise<SchemaResp> => {
  return getApi(urlType.playbook.schema);
};

// 上传playbook step需要的文件
export const uploadStepFileApi = (data: { files: any }, config?: AxiosRequestConfig): Promise<UploadStepFileResp> => {
  const { files } = data;
  const formData = new FormData();
  for (const k in files) {
    // eslint-disable-next-line no-prototype-builtins
    if (files.hasOwnProperty(k)) {
      formData.append('files', files[k]);
    }
  }
  return postApi(urlType.playbook.upload_file, formData, {
    ...config,
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 86400000 // 一天
  });
};

// 获取player列表
export const getPlayerListApi = (): Promise<HTTPResult> => {
  return getApi(urlType.playbook.player);
};

// 添加player
export const addPlayerApi = (data: Player, config?: AxiosRequestConfig): Promise<HTTPResult> => {
  const formData = new FormData();
  for (const k in data) {
    // eslint-disable-next-line no-prototype-builtins
    if (data.hasOwnProperty(k)) {
      formData.append(k, data[k]);
    }
  }
  return postApi(urlType.playbook.upload_file, formData, {
    ...config,
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 86400000 // 一天
  });
};

// 删除其中一个player
export const deletePlayerApi = (id: number): Promise<HTTPResult> => {
  return deleteApi(`${urlType.playbook.player}/${id}`);
};
