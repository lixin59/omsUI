const testHost = import.meta.env.VITE_TEST_HOST;

const localhost = testHost || window.location.host;

export const baseUrl = `http://${localhost}/api/v1`;

export const urlType = {
  host: '/host',
  tag: '/tag',
  group: '/group',
  tunnel: '/tunnel',
  job: '/job',
  jobStart: 'job/start',
  jobStop: 'job/stop',
  jobLogs: 'job/tail',
  upload_file: '/tools/upload',
  fileBrowser: '/tools/browse',
  deleteFile: '/tools/delete',
  mkdir: '/tools/mkdir'
};
