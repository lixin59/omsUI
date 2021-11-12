import { getApi, postApi, deleteApi, putApi } from './api';
import { urlType } from './requestUrl';

export interface HTTPResult {
  code:string,
  msg:string,
  data: any | any[]
}

export interface EditHostPut {
  id: number,
  hostname?: string,
  user?: string,
  addr?: string,
  port?: number,
  group?: number,
  password?: string,
  keyFile?: any,
  tags?: string[],
}

export interface AddHostPost {
  hostname: string,
  user: string,
  addr: string,
  port: number,
  group: number,
  password: string,
  keyFile?: any,
  tags?: string[],
}

export interface AddGroupPost {
  name: string,
  mode: 0 | 1,
  params?: string,
}

export interface EditGroupPut {
  id: number,
  name?: string,
  mode?: 0 | 1,
  params?: string,
};


export interface AddTunnelPost {
  mode: 'local' | 'remote',
  source: string,
  destination: string,
  host_id: number,
}

export interface EditTunnelPut {
  id: number,
  mode?: 'local' | 'remote',
  source?: string,
  destination?: string,
  host_id?: number,
};

export interface AddJobPost {
  name: string,
  type: 'cron' | 'task',
  spec: string,
  cmd: string,
  host_id: number,
}

export interface EditJobPut {
  id: number,
  name?: string,
  type?: 'cron' | 'task',
  spec?: string,
  cmd?: string,
};

// 获取所有主机信息
export const getHostsApi = (config: any = {}) => {
  return getApi(urlType.host, config);
};

// 通过id获取主机信息
export const getHostApi = (id: number) => {
  return getApi(`${urlType.host}/${id}`, {});
};

// 新增一个主机
export const addHostApi = (data: AddHostPost) => {
  const formData = new FormData();
  for (const k in data) {
    if (data.hasOwnProperty(k)) {
      // @ts-ignore
      formData.append(k, data[k]);
    }
  }
  return postApi(urlType.host, formData, {});
};

// 修改主机信息
export const editHostApi = (data: EditHostPut) => {
  const formData = new FormData();
  for (const k in data) {
    if (data.hasOwnProperty(k)) {
      // @ts-ignore
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
  return postApi(urlType.tag, name);
};

// 修改tag
export const editTagApi = (data: {
  id: number,
  name: string
}) => {
  return putApi(urlType.tag, data);
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
  return postApi(urlType.group, data);
};

// 修改 group
export const editGroupApi = (data: EditGroupPut) => {
  return putApi(urlType.group, data);
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
  return postApi(urlType.tunnel, data);
};

// 修改 tunnel
export const editTunnelApi = (data: EditTunnelPut) => {
  return putApi(urlType.tunnel, data);
};

// 删除 tunnel
export const deleteTunnelApi = (id: number) => {
  return deleteApi(urlType.tunnel, id);
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
  return postApi(urlType.job, data);
};

// 修改 job
export const editJobApi = (data: EditJobPut) => {
  return putApi(urlType.job, data);
};

// 删除 job
export const deleteJobApi = (id: number) => {
  return deleteApi(`${urlType.job}/${id}`);
};

