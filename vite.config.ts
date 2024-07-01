import { defineConfig, loadEnv } from 'vite';
import type { ConfigEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
const root = process.cwd();
// https://vitejs.dev/config/
export default defineConfig(({ command, mode }: ConfigEnv) => {
  const env = loadEnv(mode, root);
  console.log(
    '\x1B[46m-------------------------------------------------环境变量配置信息----------------------------------------------\x1B[0m'
  );
  console.log('\x1B[42m vite config mode: \x1B[0m', mode);
  console.log('\x1B[42m vite config command: \x1B[0m', command);
  for (const envKey in env) {
    console.log(`\x1B[42m ${envKey}: \x1B[0m`, env[envKey]);
  }
  console.log(
    '\x1B[46m--------------------------------------------------------------------------------------------------------------\x1B[0m'
  );
  return {
    server: {
      host: true,
      port: 3002
      // proxy: {
      //   // 后端开启了跨域前端可以不配置代理
      //   ['/api']: {
      //     target: env.VITE_TEST_HOST,
      //     ws: false,
      //     changeOrigin: true,
      //     rewrite: (path) => path.replace(new RegExp(`^/api`), '')
      //   }
      // }
    },
    build: {
      target: ['chrome87', 'edge88', 'es2021', 'firefox78', 'safari14']
    },
    plugins: [react()]
  };
});
