import { getApi, postApi, deleteApi, putApi } from './api';
import { urlType } from './requestUrl';

interface EditHostPost {
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
export const editHost = (data: EditHostPost) => {
  const formData = new FormData();
  for (const k in data) {
    if (data.hasOwnProperty(k)) {
      // @ts-ignore
      formData.append(k, data[k]);
    }
  }
  return postApi(urlType.host, formData, {});
};

// 删除主机

export const deleteHost = (id: number) => {
  return deleteApi(`${urlType.host}/${id}`, {});
};

// 获取所有tag

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
