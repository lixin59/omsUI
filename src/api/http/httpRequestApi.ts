import { getApi, postApi, deleteApi } from './api';
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
