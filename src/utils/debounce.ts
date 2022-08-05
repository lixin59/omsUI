// 防抖函数
export const debounce = (func, wait = 50) => {
  // 缓存一个定时器id
  let timer: any = 0;
  // 这里返回的函数是每次用户实际调用的防抖函数
  // 如果已经设定过定时器了就清空上一次的定时器
  // 开始一个新的定时器，延迟执行用户传入的方法
  // fixme 修复this类型
  return function (this: any, ...args) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, wait);
  };
};
