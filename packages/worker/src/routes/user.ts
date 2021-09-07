import { nanoid } from 'nanoid';
import { fetchAsset } from '../lib/assets';
import { validateSession } from '../lib/auth';
import { UserStore } from '../lib/kv';
import { API400, APIRequestHandler, APIResponse } from '../lib/route';
import { CreateUserInput } from '../lib/schema';
import generatePass from '../lib/pass';
import { imageKey } from './images';
import { AugmentedEnvironment } from '..';

const pingWatcher = async (request: Request, env: AugmentedEnvironment) => {
  const id = env.USER_WATCHER.idFromString('okonomia');
  const watcherObject = env.USER_WATCHER.get(id);
  const newURL = new URL(request.url);
  newURL.pathname = '/update';

  return watcherObject.fetch(newURL.toString(), request);
};

export const createUser: APIRequestHandler = async (request, env) => {
  try {
    await validateSession(request);
  } catch {
    return new Response('Unauthorized', {
      status: 401,
      statusText: 'Unauthorized',
    });
  }

  const input = await request.json();
  const data = CreateUserInput.parse(input);

  const newUser = {
    ...data,
    hasPaid: false,
    isAdmin: false,
    id: nanoid(),
  };

  const user = await env.kv.users.put(newUser.id, newUser);

  await pingWatcher(request, env);

  return APIResponse({
    data: { user },
  });
};

export const watchUsers: APIRequestHandler = async (request, env) => {
  // try {
  //   await validateSession(request);
  // } catch {
  //   return new Response('Unauthorized', {
  //     status: 401,
  //     statusText: 'Unauthorized',
  //   });
  // }

  const id = env.USER_WATCHER.idFromString('okonomia');
  const watcherObject = env.USER_WATCHER.get(id);
  const newURL = new URL(request.url);
  newURL.pathname = '/websocket';

  return watcherObject.fetch(newURL.toString(), request);
};

export const deleteUser: APIRequestHandler = async (request, env) => {
  try {
    await validateSession(request);
  } catch {
    return new Response('Unauthorized', {
      status: 401,
      statusText: 'Unauthorized',
    });
  }

  const id = request.params?.id;
  if (!id) return API400();

  await env.kv.users.delete(id);

  await pingWatcher(request, env);

  return APIResponse({
    data: {
      success: true,
    },
  });
};

export const promoteUserToAdmin: APIRequestHandler = async (request, env) => {
  try {
    await validateSession(request);
  } catch {
    return new Response('Unauthorized', {
      status: 401,
      statusText: 'Unauthorized',
    });
  }

  const id = request.params?.id;
  if (!id) return API400();

  const user = await UserStore(env).get(id);
  if (!user) return API400();

  const updatedUser = {
    ...user,
    isAdmin: true,
  };
  await UserStore(env).put(id, updatedUser);

  await pingWatcher(request, env);

  return APIResponse({
    data: {
      user,
    },
  });
};

export const demoteUserToMember: APIRequestHandler = async (request, env) => {
  try {
    await validateSession(request);
  } catch {
    return new Response('Unauthorized', {
      status: 401,
      statusText: 'Unauthorized',
    });
  }

  const id = request.params?.id;
  if (!id) return API400();

  const user = await UserStore(env).get(id);
  if (!user) return API400();

  const updatedUser = {
    ...user,
    isAdmin: false,
  };
  await UserStore(env).put(id, updatedUser);

  await pingWatcher(request, env);

  return APIResponse({
    data: {
      user,
    },
  });
};

export const allUsers: APIRequestHandler = async (request, env) => {
  try {
    await validateSession(request);
  } catch {
    return new Response('Unauthorized', {
      status: 401,
      statusText: 'Unauthorized',
    });
  }

  const userKeys = await env.USERS.list({ prefix: 'USER:INFO:' });
  const userPromises = userKeys.keys.map(async (key) => {
    const userJSON = await env.USERS.get(key.name);
    return userJSON && JSON.parse(userJSON);
  });
  const users = await Promise.all(userPromises);

  return APIResponse({
    data: { users },
  });
};

export const idForUser: APIRequestHandler = async (request, env) => {
  if (!env.PASSBOOK_CERT || !env.PASSBOOK_PRIVATE_KEY)
    throw new Error(
      'PASSBOOK_CERT and PASSBOOK_PRIVATE_KEY should be provided as environment variables',
    );

  const id = request.params?.id;
  if (!id) return API400();

  const user = await UserStore(env).get(id);
  if (!user) return API400();

  const image = await env.BUCKET.get(
    imageKey(user.imageKey, 'png'),
    'arrayBuffer',
  );
  const template = await fetchAsset('assets/template.pkpass', env);
  const zip = await generatePass(
    template,
    {
      organizationName: 'Ökonomía',
      backgroundColor: 'rgb(248,243,243)',
      foregroundColor: 'rgb(3,3,3)',
      logoText: 'Ökonomía',
      generic: {
        primaryFields: [
          {
            key: 'member',
            label: 'Nafn',
            value: user.name,
            // changeMessage: 'Member name changed to %@.',
          },
        ],
        secondaryFields: [],
        auxiliaryFields: [
          {
            key: 'membershipNumber',
            label: 'Meðlimsnúmer',
            value: '123456789123456789',
            // changeMessage: 'Changed to %@',
          },
          {
            key: 'memberSince',
            label: 'Gildistími',
            value: 'Ágúst 2020 - Júlí 2021',
          },
        ],
        backFields: [
          {
            key: 'info',
            label: 'Afslættir',
            value:
              'Þetta kort veitir þér afslætti á drykkjum á eftirfarandi stöðum: \n • Sæta Svínið - 20% \n • Jólahúsið Akureyri - 20%',
          },
        ],
      },
      serialNumber: '6110757dcaa7dfa0',
      formatVersion: 1,
      description: 'Membership card for Ökonomía',
      passTypeIdentifier: 'pass.skirteini.okonomia.hi.is',
      teamIdentifier: 'L5TEPZ8S7Z',
      barcodes: [
        {
          format: 'PKBarcodeFormatPDF417',
          message: '6110757dcaa70',
          messageEncoding: 'iso-8859-1',
        },
      ],
    },
    env.PASSBOOK_CERT,
    env.PASSBOOK_PRIVATE_KEY,
    image,
  );
  return new Response(zip, {
    headers: {
      'Content-Type': 'application/vnd.apple.pkpass',
      'Content-Disposition': 'attachment; filename="okonomia.pkpass"',
    },
  });
};
