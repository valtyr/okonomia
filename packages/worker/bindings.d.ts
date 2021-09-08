export {};

declare global {
  // const MY_ENV_VAR: string;
  // const MY_SECRET: string;
  // const myKVNamespace: KVNamespace;
  // const USERS: KVNamespace;

  interface Env {
    USERS: KVNamespace;
    ASSETS: KVNamespace;
    BUCKET: KVNamespace;

    USER_WATCHER: DurableObjectNamespace;

    __STATIC_CONTENT_MANIFEST: string | Record<string, string>;
    __STATIC_CONTENT: KVNamespace;

    PASSBOOK_CERT?: string;
    PASSBOOK_PRIVATE_KEY?: string;
    FIREBASE_CERT?: string;

    ENVIRONMENT?: string;
  }

  /**
   * Git hash of current commit. Will be ambiguous in development.
   */
  const GIT_HASH: string;

  // Missing types
  interface WebSocket {
    accept(): void;
  }

  class WebSocketPair {
    0: WebSocket;
    1: WebSocket;
  }

  interface ResponseInit {
    webSocket?: WebSocket;
  }

  interface Request {
    params?: { [_: string]: string };
  }
}
