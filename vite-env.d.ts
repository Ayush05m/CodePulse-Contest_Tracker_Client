/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string; // Ensure VITE_API_URL is recognized
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
