import { AxiosResponse } from 'axios';

export function a11yProps(index: any) {
  return {
    'id': `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`
  };
}

export function convertRes2Blob(response: AxiosResponse) {
  try {
    // 提取文件名
    const fileName = response.headers['content-disposition']!.match(/filename=\"(.*)\"/)![1];
    // 将二进制流转为blob
    const blob = new Blob([response.data], { type: response.headers['content-type'] });
    // if (typeof window.navigator.msSaveBlob !== 'undefined') {
    //   // 兼容IE，window.navigator.msSaveBlob：以本地方式保存文件
    //   window.navigator.msSaveBlob(blob, decodeURI(fileName));
    // } else {
    // }
    // 创建新的URL并指向File对象或者Blob对象的地址
    const blobURL = window.URL.createObjectURL(blob);
    // 创建a标签，用于跳转至下载链接
    const tempLink = document.createElement('a');
    tempLink.style.display = 'none';
    console.log('url', blobURL);
    tempLink.href = blobURL;
    tempLink.target = '_blank';
    tempLink.setAttribute('download', decodeURI(fileName));
    // 兼容：某些浏览器不支持HTML5的download属性
    if (typeof tempLink.download === 'undefined') {
      tempLink.setAttribute('target', '_blank');
    }
    // 挂载a标签
    document.body.appendChild(tempLink);
    tempLink.click();
    document.body.removeChild(tempLink);
    // 释放blob URL地址
    window.URL.revokeObjectURL(blobURL);
  } catch (e) {
    console.log(e);
  }
}

export function downloadFile(url: string, fileName: string): void {
  const tempLink = document.createElement('a');
  tempLink.style.display = 'none';
  tempLink.href = url;
  tempLink.target = '_blank';
  tempLink.setAttribute('download', decodeURI(fileName));
  // 兼容：某些浏览器不支持HTML5的download属性
  if (typeof tempLink.download === 'undefined') {
    tempLink.setAttribute('target', '_blank');
  }
  // 挂载a标签
  document.body.appendChild(tempLink);
  tempLink.click();
  document.body.removeChild(tempLink);
  // 释放blob URL地址
  window.URL.revokeObjectURL(url);
}

export function getFileType(filePath: any): string {
  if (typeof filePath !== 'string') {
    return '';
  }
  const startIndex = filePath.lastIndexOf('.');
  if (startIndex !== -1) { return filePath.substring(startIndex + 1, filePath.length).toLowerCase(); } else return '';
}
