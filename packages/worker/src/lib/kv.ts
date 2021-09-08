import { User } from './schema';

const putJSON =
  <T>(ns: KVNamespace, keyFunction: (id: string) => string) =>
  async (id: string, data: T) =>
    await ns.put(keyFunction(id), JSON.stringify(data));

const getJSON =
  <T>(ns: KVNamespace, keyFunction: (id: string) => string) =>
  async (id: string): Promise<T | null> => {
    const raw = await ns.get(keyFunction(id));
    return raw && JSON.parse(raw);
  };

const deleteKey =
  (ns: KVNamespace, keyFunction: (id: string) => string) =>
  async (id: string): Promise<void> => {
    await ns.delete(keyFunction(id));
  };

const userKey = (id: string): string => `USER:INFO:${id}`;
const userAdminKey = (id: string): string => `USER:ADMIN:${id}`;
const userEmailKey = (email: string): string => `USER:EMAIL:${email}`;
export const UserStore = (env: Env) => ({
  checkIsAdmin: async (email: string): Promise<boolean> => {
    const id = await env.USERS.get(userEmailKey(email));
    if (id == null) return false;

    const isAdmin = await env.USERS.get(userAdminKey(id));
    if (isAdmin == null) return false;

    return true;
  },
  setIsAdmin: async (id: string) => {
    await env.USERS.put(userAdminKey(id), 'true');
  },
  unsetIsAdmin: async (id: string) => {
    await env.USERS.delete(userAdminKey(id));
  },
  setEmailKey: async (id: string, email: string) => {
    await env.USERS.put(userEmailKey(email), id);
  },
  getEmailKey: async (email: string) => {
    await env.USERS.get(userEmailKey(email));
  },
  deleteEmailKey: async (email: string) => {
    await env.USERS.delete(userEmailKey(email));
  },
  put: putJSON<User>(env.USERS, userKey),
  get: getJSON<User>(env.USERS, userKey),
  list: env.USERS.list,
  delete: deleteKey(env.USERS, userKey),
});
