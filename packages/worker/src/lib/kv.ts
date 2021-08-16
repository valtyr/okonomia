import { User } from './schema';

const putJSON = <T>(
  ns: KVNamespace,
  keyFunction: (id: string) => string,
) => async (id: string, data: T) =>
  await ns.put(keyFunction(id), JSON.stringify(data));

const getJSON = <T>(
  ns: KVNamespace,
  keyFunction: (id: string) => string,
) => async (id: string): Promise<T | null> => {
  const raw = await ns.get(keyFunction(id));
  return raw && JSON.parse(raw);
};

const userKey = (id: string) => `USER:INFO:${id}`;
export const UserStore = (env: Env) => ({
  put: putJSON<User>(env.USERS, userKey),
  get: getJSON<User>(env.USERS, userKey),
  list: env.USERS.list,
});
