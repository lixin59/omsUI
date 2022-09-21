import { postApi, putApi, getApi, deleteApi } from './api';
import { baseUrl, playbookUrl, pluginUrl, urlType } from './requestUrl';
import { HTTPResult } from './httpRequestApi';
import { AxiosRequestConfig } from 'axios';
import { downloadFile } from '../../utils';

type tStepType = 'cmd' | 'shell' | 'file'; // 插件类型

export type tSchemaInfo = {
  type: tStepType;
  desc: string;
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

interface Player {
  name: string;
  steps: string; // stringify(steps: tStep[])
}

// // 导入插件
export const importPluginApi = (data: { files: any }) => {
  const { files } = data;
  const formData = new FormData();
  for (const k in files) {
    // eslint-disable-next-line no-prototype-builtins
    if (files.hasOwnProperty(k)) {
      formData.append('files', files[k]);
    }
  }
  return postApi(pluginUrl.upload, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 86400000 // 一天
  });
};

// 导出剧本
export const exportPlayerApi = () => {
  const url = `${baseUrl}${playbookUrl.player.export}`;
  downloadFile(url, 'oms');
};
// 导入剧本
export const importPlayerApi = (data: { files: any }) => {
  const { files } = data;
  const formData = new FormData();
  for (const k in files) {
    // eslint-disable-next-line no-prototype-builtins
    if (files.hasOwnProperty(k)) {
      formData.append('files', files[k]);
    }
  }
  return postApi(playbookUrl.player.import, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 86400000 // 一天
  });
};

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
  return postApi(urlType.playbook.player, formData, {
    ...config,
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 86400000 // 一天
  });
};

// 编辑player
export const editPlayerApi = (data: { id: number } & Player, config?: AxiosRequestConfig): Promise<HTTPResult> => {
  const formData = new FormData();
  for (const k in data) {
    // eslint-disable-next-line no-prototype-builtins
    if (data.hasOwnProperty(k)) {
      formData.append(k, data[k]);
    }
  }
  return putApi(`${urlType.playbook.player}`, formData, {
    ...config,
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 86400000 // 一天
  });
};

// 删除其中一个player
export const deletePlayerApi = (id: number): Promise<HTTPResult> => {
  return deleteApi(`${urlType.playbook.player}/${id}`);
};
