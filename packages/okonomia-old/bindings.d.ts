export {};

declare global {
  // const MY_ENV_VAR: string;
  // const MY_SECRET: string;
  // const myKVNamespace: KVNamespace;
  // const USERS: KVNamespace;

  interface Env {
    USERS: KVNamespace;
  }

  const env: Env;
}
