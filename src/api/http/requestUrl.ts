import { testHost } from './config';

const localhost = testHost || window.location.origin;

export const baseUrl = `${localhost}/api/v1`;

export const urlType = {
  host: '/host',
  tag: '/tag',
  group: '/group',
  tunnel: '/tunnel',
  job: '/job',
  jobStart: 'job/start',
  jobStop: 'job/stop',
  jobLogs: 'job/tail',
  upload_file: '/tools/upload_file'
};
