export function bytesToSize(size: number): string {
  let Str = '';
  if (size < 0.1 * 1024) {
    // 小于0.1KB，则转化成B
    Str = size.toFixed(2) + 'B';
  } else if (size < 0.1 * 1024 * 1024) {
    // 小于0.1MB，则转化成KB
    Str = (size / 1024).toFixed(2) + 'KB';
  } else if (size < 0.1 * 1024 * 1024 * 1024) {
    // 小于0.1GB，则转化成MB
    Str = (size / (1024 * 1024)).toFixed(2) + 'MB';
  } else {
    // 其他转化成GB
    Str = (size / (1024 * 1024 * 1024)).toFixed(2) + 'GB';
  }

  // 转成字符串
  const sizeStr = Str + '',
    // 获取小数点处的索引
    index = sizeStr.indexOf('.'),
    // 获取小数点后两位的值
    dou = sizeStr.substr(index + 1, 2);

  // 判断后两位是否为00，如果是则删除00
  if (dou === '00') return sizeStr.substring(0, index) + sizeStr.substr(index + 3, 2);

  return sizeStr;
}
