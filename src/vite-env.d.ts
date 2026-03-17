/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CONVAI_API_KEY: string;
  readonly VITE_CONVAI_CHARACTER_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare const __CONVAI_API_KEY__: string;
declare const __CONVAI_CHARACTER_ID__: string;
