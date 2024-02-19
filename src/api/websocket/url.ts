let testHost = '';
if (import.meta.env.DEV) {
  // 开发环境使用配置的host
  testHost = import.meta.env.VITE_TEST_HOST;
}

const localhost = testHost || window.location.host;

export const baseUrl = `${document.location.protocol==='https:'? 'wss': 'ws'}://${localhost}/ws/`;

export const url = {
  index: 'index',
  vnc: 'vnc'
};

export const websocketURL = {
  vnc: `${baseUrl}vnc/`
};
