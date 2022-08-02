import { getApi, postApi, deleteApi, putApi } from './api';
import { urlType, baseUrl } from './requestUrl';
import { Base64 } from 'js-base64';
import { AxiosRequestConfig } from 'axios';

export interface HTTPResult {
  code: string;
  msg: string;
  data: any | any[];
}

export interface EditHostPut {
  id: number;
  hostname?: string;
  user?: string;
  addr?: string;
  port?: number;
  vnc_port?: number;
  group?: number;
  password?: string;
  private_key_id?: any;
  tags?: string; // "[1,2]"
}

export interface AddHostPost {
  hostname: string;
  user: string;
  addr: string;
  port: number;
  vnc_port?: number;
  group: number;
  password: string;
  private_key_id?: any;
  tags?: string; // "[1,2]",
}

export interface AddGroupPost {
  name: string;
  mode: 0 | 1;
  params?: string;
}

export interface EditGroupPut {
  id: number;
  name?: string;
  mode?: 0 | 1;
  params?: string;
}

export interface AddTunnelPost {
  mode: 'local' | 'remote';
  source: string;
  destination: string;
  host_id: number;
}

export interface EditTunnelPut {
  id: number;
  mode?: 'local' | 'remote';
  source?: string;
  destination?: string;
  host_id?: number;
}

export interface AddJobPost {
  name: string;
  type: 'cron' | 'task';
  spec: string;
  cmd: string;
  host_id: number;
}

export interface EditJobPut {
  id: number;
  name?: string;
  type?: 'cron' | 'task';
  spec?: string;
  cmd?: string;
}

export interface UploadFilePost {
  id: number; // host | group | tag的id,
  type: 'host' | 'group' | 'tag';
  remote: string; // 远端路径
  files: any;
}

// 获取所有主机信息
export const getHostsApi = (): Promise<HTTPResult> => {
  return getApi(urlType.host);
};

// 通过id获取主机信息
export const getHostApi = (id: number) => {
  return getApi(`${urlType.host}/${id}`, {});
};

// 新增一个主机
export const addHostApi = (data: AddHostPost) => {
  const formData = new FormData();
  for (const k in data) {
    // eslint-disable-next-line no-prototype-builtins
    if (data.hasOwnProperty(k)) {
      formData.append(k, data[k]);
    }
  }
  return postApi(urlType.host, formData, {});
};

// 修改主机信息
export const editHostApi = (data: EditHostPut) => {
  const formData = new FormData();
  for (const k in data) {
    // eslint-disable-next-line no-prototype-builtins
    if (data.hasOwnProperty(k)) {
      formData.append(k, data[k]);
    }
  }
  return putApi(urlType.host, formData, {});
};

// 删除主机

export const deleteHostApi = (id: number) => {
  return deleteApi(`${urlType.host}/${id}`, {});
};

// 获取所有 tag
export const getTagsApi = () => {
  return getApi(urlType.tag);
};

// 通过id获取tag信息
export const getTagApi = (id: number) => {
  return getApi(`${urlType.tag}/${id}`);
};

// 新增tag
export const addTagApi = (name: string) => {
  const data = {
    name
  };
  const formData = new FormData();
  for (const k in data) {
    // eslint-disable-next-line no-prototype-builtins
    if (data.hasOwnProperty(k)) {
      formData.append(k, data[k]);
    }
  }
  return postApi(urlType.tag, formData);
};

// 修改tag
export const editTagApi = (data: { id: number; name: string }) => {
  const formData = new FormData();
  for (const k in data) {
    // eslint-disable-next-line no-prototype-builtins
    if (data.hasOwnProperty(k)) {
      formData.append(k, data[k]);
    }
  }
  return putApi(urlType.tag, formData);
};

// 删除tag
export const deleteTagApi = (id: number) => {
  return deleteApi(`${urlType.tag}/${id}`);
};

// 获取所有 Group
export const getGroupsApi = () => {
  return getApi(urlType.group);
};

// 通过id获取 group 信息
export const getGroupApi = (id: number) => {
  return getApi(`${urlType.group}/${id}`);
};

// 新增 group
export const addGroupApi = (data: AddGroupPost) => {
  const formData = new FormData();
  for (const k in data) {
    // eslint-disable-next-line no-prototype-builtins
    if (data.hasOwnProperty(k)) {
      formData.append(k, data[k]);
    }
  }
  return postApi(urlType.group, formData);
};

// 修改 group
export const editGroupApi = (data: EditGroupPut) => {
  const formData = new FormData();
  for (const k in data) {
    // eslint-disable-next-line no-prototype-builtins
    if (data.hasOwnProperty(k)) {
      formData.append(k, data[k]);
    }
  }
  return putApi(urlType.group, formData);
};

// 删除 group
export const deleteGroupApi = (id: number) => {
  return deleteApi(`${urlType.group}/${id}`);
};

// 获取所有 tunnel
export const getTunnelsApi = () => {
  return getApi(urlType.tunnel);
};

// 通过id获取 tunnel 信息
export const getTunnelApi = (id: number) => {
  return getApi(`${urlType.tunnel}/${id}`);
};

// 新增 tunnel
export const addTunnelApi = (data: AddTunnelPost) => {
  const formData = new FormData();
  for (const k in data) {
    // eslint-disable-next-line no-prototype-builtins
    if (data.hasOwnProperty(k)) {
      formData.append(k, data[k]);
    }
  }
  return postApi(urlType.tunnel, formData);
};

// 修改 tunnel
export const editTunnelApi = (data: EditTunnelPut) => {
  const formData = new FormData();
  for (const k in data) {
    // eslint-disable-next-line no-prototype-builtins
    if (data.hasOwnProperty(k)) {
      formData.append(k, data[k]);
    }
  }
  return putApi(urlType.tunnel, formData);
};

// 删除 tunnel
export const deleteTunnelApi = (id: number) => {
  return deleteApi(`${urlType.tunnel}/${id}`);
};

// 获取所有 job
export const getJobsApi = () => {
  return getApi(urlType.job);
};

// 通过id获取 job 信息
export const getJobApi = (id: number) => {
  return getApi(`${urlType.job}/${id}`);
};

// 新增 job
export const addJobApi = (data: AddJobPost) => {
  const formData = new FormData();
  for (const k in data) {
    // eslint-disable-next-line no-prototype-builtins
    if (data.hasOwnProperty(k)) {
      formData.append(k, data[k]);
    }
  }
  return postApi(urlType.job, formData);
};

// 修改 job
export const editJobApi = (data: EditJobPut) => {
  const formData = new FormData();
  for (const k in data) {
    // eslint-disable-next-line no-prototype-builtins
    if (data.hasOwnProperty(k)) {
      formData.append(k, data[k]);
    }
  }
  return putApi(urlType.job, formData);
};

// 删除 job
export const deleteJobApi = (id: number) => {
  return deleteApi(`${urlType.job}/${id}`);
};

// 启动job
export const jobStartApi = (id: number) => {
  const data = { id };
  const formData = new FormData();
  for (const k in data) {
    // eslint-disable-next-line no-prototype-builtins
    if (data.hasOwnProperty(k)) {
      formData.append(k, data[k]);
    }
  }
  return postApi(`${urlType.jobStart}`, formData);
};

// 停止job
export const jobStopApi = (id: number) => {
  const data = { id };
  const formData = new FormData();
  for (const k in data) {
    // eslint-disable-next-line no-prototype-builtins
    if (data.hasOwnProperty(k)) {
      formData.append(k, data[k]);
    }
  }
  return postApi(`${urlType.jobStop}`, formData);
};

// 查看job日志
export const jobLogsApi = (id: number) => {
  return getApi(`${urlType.jobLogs}`, { id });
  // return `${baseUrl}${urlType.jobLogs}?id=${id}`;
};

export const jobLogsUrlApi = (id: number) => {
  // return getApi(`${urlType.jobLogs}`, { id });
  return `${baseUrl}/${urlType.jobLogs}?id=${id}`;
};

// 文件分发 上传文件
export const uploadFileApi = (data: UploadFilePost, config?: AxiosRequestConfig) => {
  const formData = new FormData();
  const files: { [index: string]: any } = {};
  const fileList = { ...data.files };
  for (const k in data) {
    // eslint-disable-next-line no-prototype-builtins
    if (data.hasOwnProperty(k) && k !== 'files') {
      formData.append(k, data[k]);
    }
  }
  // eslint-disable-next-line guard-for-in
  for (const k in fileList) {
    files[Base64.encode(fileList[k].name)] = fileList[k].size;
    formData.append('files', fileList[k]);
  }
  return postApi(`${urlType.upload_file}`, formData, {
    headers: {
      'X-Files': JSON.stringify(files)
    },
    timeout: 86400000, // 一天
    ...config
  });
};

// 文件浏览
export const fileBrowserApi = (data: {
  host_id: string | number; // host的ID
  id: any; // 文件路径
}) => {
  return getApi(`${urlType.fileBrowser}`, data, { timeout: 20000 });
};

// 删除文件
export const deleteFileApi = (data: {
  host_id: string | number; // host的ID
  id: any; // 文件路径或者文件名
}) => {
  const formData = new FormData();
  for (const k in data) {
    // eslint-disable-next-line no-prototype-builtins
    if (data.hasOwnProperty(k)) {
      formData.append(k, data[k]);
    }
  }
  return postApi(`${urlType.deleteFile}`, formData);
};

// 创建文件夹
export const createFileApi = (data: {
  host_id: string | number; // host的ID
  id: any; // 文件父路径
  dir: string; // 文件夹名称
}) => {
  const formData = new FormData();
  for (const k in data) {
    // eslint-disable-next-line no-prototype-builtins
    if (data.hasOwnProperty(k)) {
      formData.append(k, data[k]);
    }
  }
  return postApi(`${urlType.mkdir}`, formData);
};

// 下载文件
export const downloadFileApi = (data: {
  host_id: string | number; // host的ID
  id: any; // 文件路径 如/root/go/robots.txt
}) => {
  return getApi(`${urlType.download_file}`, { ...data }, { responseType: 'blob', timeout: 1000 });
};

// 预览文件
export const previewFileApi = (data: {
  host_id: string | number; // host的ID
  id: any; // 文件路径 如/root/go/robots.txt
}) => {
  return getApi(`${urlType.preview_file}`, { ...data }, { timeout: 86400000 });
};

// 新增密钥
export const addPrivateKeyApi = (data: {
  name: string; // 某主机秘钥
  passphrase?: string; // 秘钥的密码
  key_file: any; // 秘钥文件
}) => {
  const formData = new FormData();
  for (const k in data) {
    // eslint-disable-next-line no-prototype-builtins
    if (data.hasOwnProperty(k)) {
      formData.append(k, data[k]);
    }
  }
  return postApi(urlType.privateKey, formData, { headers: { 'Content-Type': 'multipart/form-data' }});
};

// 获取所有密钥
export const getPrivateKeysApi = () => {
  return getApi(urlType.privateKey);
};

// 获取单个密钥
export const getPrivateKeyApi = (id: number) => {
  return getApi(`${urlType.privateKey}/${id}`);
};

// 修改密钥
export const editPrivateKeyApi = (data: { id: number; name: string; passphrase?: string; key_file?: any }) => {
  const formData = new FormData();
  for (const k in data) {
    // eslint-disable-next-line no-prototype-builtins
    if (data.hasOwnProperty(k)) {
      formData.append(k, data[k]);
    }
  }
  return putApi(urlType.privateKey, formData, { headers: { 'Content-Type': 'multipart/form-data' }});
};

// 删除密钥
export const deletePrivateKeyApi = (id: number) => {
  return deleteApi(`${urlType.privateKey}/${id}`, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' }});
};
