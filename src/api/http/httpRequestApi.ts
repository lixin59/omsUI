import { getApi, postApi, deleteApi, putApi } from './api';
import { urlType } from './requestUrl';

interface EditHostPut {
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

interface AddHostPost {
  hostname: string,
  user: string,
  addr: string,
  port: number,
  group: number,
  password: string,
  keyFile?: any,
  tags?: string[],
}

interface AddGroupPost {
  name: string,
  mode: 0 | 1,
  params?: string,
}

interface EditGroupPut {
  id: number,
  name?: string,
  mode?: 0 | 1,
  params?: string,
};


interface AddTunnelPost {
  mode: 'local' | 'remote',
  src: string,
  dest: string,
  host_id: number,
}

interface EditTunnelPut {
  id: string
  mode?: 'local' | 'remote',
  src?: string,
  dest?: string,
  host_id?: number,
};

interface AddJobPost {
  name: string,
  type: 'cron' | 'task',
  spec: string,
  cmd: string,
  host_id: number,
}

interface EditJobPut {
  id: number,
  name?: string,
  type?: 'cron' | 'task',
  spec?: string,
  cmd?: string,
};

// 获取所有主机信息
export const getAllHostInfo = (config: any = {}) => {
  return getApi(urlType.host, config);
};

// 通过id获取主机信息
export const getHostInfoById = (id: number) => {
  return getApi(`${urlType.host}/${id}`, {});
};

// 新增一个主机
export const addHost = (data: AddHostPost) => {
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
export const editHost = (data: EditHostPut) => {
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

export const deleteHost = (id: number) => {
  return deleteApi(`${urlType.host}/${id}`, {});
};


// 获取所有 tag
export const getTags = () => {
  return getApi(urlType.tag);
};

// 通过id获取tag信息
export const getTag = (id: number) => {
  return getApi(`${urlType.tag}/${id}`);
};

// 新增tag
export const addTag = (name: string) => {
  return postApi(urlType.tag, name);
};

// 修改tag
export const editTag = (data: {
  id: number,
  name: string
}) => {
  return putApi(urlType.tag, data);
};

// 删除tag
export const deleteTag = (id: number) => {
  return deleteApi(urlType.tag, id);
};


// 获取所有 Group
export const getGroups = () => {
  return getApi(urlType.group);
};

// 通过id获取 group 信息
export const getGroup = (id: number) => {
  return getApi(`${urlType.group}/${id}`);
};

// 新增 group
export const addGroup = (data: AddGroupPost) => {
  return postApi(urlType.group, data);
};

// 修改 group
export const editGroup = (data: EditGroupPut) => {
  return putApi(urlType.group, data);
};

// 删除 group
export const deleteGroup = (id: number) => {
  return deleteApi(urlType.group, id);
};


// 获取所有 tunnel
export const getTunnels = () => {
  return getApi(urlType.tunnel);
};

// 通过id获取 tunnel 信息
export const getTunnel = (id: number) => {
  return getApi(`${urlType.tunnel}/${id}`);
};

// 新增 tunnel
export const addTunnel = (data: AddTunnelPost) => {
  return postApi(urlType.tunnel, data);
};

// 修改 tunnel
export const editTunnel = (data: EditTunnelPut) => {
  return putApi(urlType.tunnel, data);
};

// 删除 tunnel
export const deleteTunnel = (id: number) => {
  return deleteApi(urlType.tunnel, id);
};


// 获取所有 job
export const getJobs = () => {
  return getApi(urlType.job);
};

// 通过id获取 job 信息
export const getJob = (id: number) => {
  return getApi(`${urlType.job}/${id}`);
};

// 新增 job
export const addJob = (data: AddJobPost) => {
  return postApi(urlType.job, data);
};

// 修改 job
export const editJob = (data: EditJobPut) => {
  return putApi(urlType.job, data);
};

// 删除 job
export const deleteJob = (id: number) => {
  return deleteApi(urlType.job, id);
};
