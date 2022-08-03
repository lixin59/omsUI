import { postApi, putApi, getApi } from './api';
import { urlType } from './requestUrl';
import { HTTPResult } from './httpRequestApi';

type tSchemaInfo = {
  type: 'cmd' | 'shell' | 'file'; // 插件类型
  scheme: {
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

// 获取JSON schema数据
export const getSchemaInfoApi = (): Promise<SchemaResp> => {
  return getApi(urlType.playbook.schema);
};

// 上传playbook step需要的文件
export const uploadStepFileApi = (data: { files: any }): Promise<SchemaResp> => {
  const { files } = data;
  const formData = new FormData();
  for (const k in files) {
    // eslint-disable-next-line no-prototype-builtins
    if (files.hasOwnProperty(k)) {
      formData.append('files', files[k]);
    }
  }
  return postApi(urlType.playbook.upload_file, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 86400000 // 一天
  });
};

// 获取player列表
export const getPlayerListApi = (): Promise<HTTPResult> => {
  return getApi(urlType.playbook.player);
};
