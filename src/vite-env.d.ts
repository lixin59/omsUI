// / <reference types="vite/client" />
interface ImportMetaEnv extends Readonly<Record<string, string>> {
  readonly VITE_APP_TITLE: string
  readonly VITE_TEST_HOST: string,
  readonly VITE_TEST_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
