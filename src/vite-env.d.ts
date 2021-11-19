// / <reference types="vite/client" />
interface ImportMetaEnv extends Readonly<Record<string, string>> {
  readonly VITE_TEST_HOST: string,
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
