export {};

declare global {
  // const MY_ENV_VAR: string;
  // const MY_SECRET: string;
  // const myKVNamespace: KVNamespace;
  // const USERS: KVNamespace;

  interface Env {
    USERS: KVNamespace;

    PASSBOOK_CERT?: string;
    PASSBOOK_PRIVATE_KEY?: string;
  }

  const env: Env;
}