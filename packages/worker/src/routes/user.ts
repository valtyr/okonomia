import { nanoid } from 'nanoid';
import { APIRequestHandler, APIResponse } from '../lib/route';
import { CreateUserInput } from '../lib/schema';

export const createUser: APIRequestHandler = async (request, env) => {
  const input = await request.json();
  const data = CreateUserInput.parse(input);

  const newUser = {
    ...data,
    hasPaid: false,
    isAdmin: false,
    id: nanoid(),
  };

  const user = await env.kv.users.put(newUser.id, newUser);

  console.log(newUser);

  return APIResponse({
    data: { user },
  });
};

export const allUsers: APIRequestHandler = async (_request, env) => {
  const userKeys = await env.USERS.list({ prefix: 'USER:INFO:' });
  return APIResponse({
    data: { userKeys },
  });
};
