let testHost = '';
if (import.meta.env.DEV) {
  // 开发环境使用配置的host
  testHost = import.meta.env.VITE_TEST_HOST;
}

const localhost = testHost || window.location.host;

export const baseUrl = `http://${localhost}/api/v1`;

export const urlType = {
  host: '/host',
  tag: '/tag',
  group: '/group',
  tunnel: '/tunnel',
  job: '/job',
  jobExec: 'job/exec',
  jobStart: 'job/start',
  jobStop: 'job/stop',
  jobLog: {
    info: '/task/instance/log/get',
    list: '/task/instance'
  },
  upload_file: '/tools/upload',
  download_file: '/tools/download',
  preview_file: '/tools/preview',
  fileBrowser: '/tools/browse',
  deleteFile: '/tools/delete',
  editFile: '/tools/modify',
  mkdir: '/tools/mkdir',
  tools: {
    export: '/tools/export',
    import: '/tools/import',
    upload_file_cancel: '/tools/upload/cancel'
  },
  playbook: {
    schema: '/schema', // get
    upload_file: '/cache/upload', // post
    player: '/player'
  },
  privateKey: '/private_key'
};

export const playbookUrl = {
  player: {
    export: '/player/export',
    import: '/player/import'
  }
};

export const pluginUrl = {
  upload: '/plugin/upload'
};

export const commandUrl = {
  getHistory: '/command/history',
  quick_command: '/quick_command'
};
