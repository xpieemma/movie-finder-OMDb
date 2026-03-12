/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_APP_NAME: string
  readonly VITE_BETTERSTACK_TOKEN?: string
  readonly VERCEL?: string
  readonly VERCEL_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
