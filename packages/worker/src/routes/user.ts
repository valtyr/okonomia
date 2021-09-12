import { nanoid } from 'nanoid';
import { fetchAsset } from '../lib/assets';
import { validateSession } from '../lib/auth';
import { UserStore } from '../lib/kv';
import { API400, API404, APIRequestHandler, APIResponse } from '../lib/route';
import { CreateUserInput, User } from '../lib/schema';
import generatePass from '../lib/pass';
import { imageKey } from './images';
import { AugmentedEnvironment } from '..';
import { sendPass } from '../lib/mailgun';

const pingWatcher = async (request: Request, env: AugmentedEnvironment) => {
  const id = env.USER_WATCHER.idFromName('okonomia');
  const watcherObject = env.USER_WATCHER.get(id);
  const newURL = new URL(request.url);
  newURL.pathname = '/update';

  return watcherObject.fetch(newURL.toString(), request);
};

export const createUser: APIRequestHandler = async (request, env) => {
  const input = await request.json();
  const data = CreateUserInput.parse(input);

  const newUser = {
    ...data,
    hasPaid: false,
    isAdmin: false,
    hasReceivedPass: false,
    id: nanoid(),
  };

  if (await env.kv.users.getEmailKey(newUser.email))
    return new Response(
      JSON.stringify({
        error: { message: 'Netfang er nú þegar í notkun', field: ['email'] },
      }),
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

  const user = await env.kv.users.put(newUser.id, newUser);
  await env.kv.users.setEmailKey(newUser.id, newUser.email);

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

  const id = env.USER_WATCHER.idFromName('okonomia');
  const watcherObject = env.USER_WATCHER.get(id);
  const newURL = new URL(request.url);
  newURL.pathname = '/websocket';

  return watcherObject.fetch(newURL.toString(), request);
};

export const deleteUser: APIRequestHandler = async (request, env) => {
  try {
    await validateSession(request, env);
  } catch (e) {
    return new Response('Unauthorized', {
      status: 401,
      statusText: 'Unauthorized',
      headers: {
        'X-Reason': e,
      },
    });
  }

  const id = request.params?.id;
  if (!id) return API400();

  const user = await env.kv.users.get(id);

  if (!user) return API404();

  await env.kv.users.delete(id);
  await env.kv.users.deleteEmailKey(user.email);

  return APIResponse({
    data: {
      success: true,
    },
  });
};

export const promoteUserToAdmin: APIRequestHandler = async (request, env) => {
  try {
    await validateSession(request, env);
  } catch (e) {
    return new Response('Unauthorized', {
      status: 401,
      statusText: 'Unauthorized',
      headers: {
        'X-Reason': e,
      },
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
  await UserStore(env).setIsAdmin(id);

  return APIResponse({
    data: {
      user,
    },
  });
};

export const demoteUserToMember: APIRequestHandler = async (request, env) => {
  try {
    await validateSession(request, env);
  } catch (e) {
    return new Response('Unauthorized', {
      status: 401,
      statusText: 'Unauthorized',
      headers: {
        'X-Reason': e,
      },
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
  await UserStore(env).unsetIsAdmin(id);

  return APIResponse({
    data: {
      user,
    },
  });
};

export const setHasPaid: APIRequestHandler = async (request, env) => {
  try {
    await validateSession(request, env);
  } catch (e) {
    return new Response('Unauthorized', {
      status: 401,
      statusText: 'Unauthorized',
      headers: {
        'X-Reason': e,
      },
    });
  }

  const id = request.params?.id;
  if (!id) return API400();

  const user = await UserStore(env).get(id);
  if (!user) return API404();

  const input = await request.json();
  if (input['hasPaid'] == null || typeof input['hasPaid'] !== 'boolean')
    return API400();

  const updatedUser = {
    ...user,
    hasPaid: input['hasPaid'],
  };
  await UserStore(env).put(id, updatedUser);

  return APIResponse({
    data: {
      user,
    },
  });
};

export const allUsers: APIRequestHandler = async (request, env) => {
  try {
    await validateSession(request, env);
  } catch (e) {
    return new Response('Unauthorized', {
      status: 401,
      statusText: 'Unauthorized',
      headers: {
        'X-Reason': e,
      },
    });
  }

  const userKeys = await env.USERS.list({ prefix: 'USER:INFO:' });
  const userPromises = userKeys.keys.map(async (key) => {
    const userJSON = await env.USERS.get(key.name);
    return userJSON && JSON.parse(userJSON);
  });
  // Filter out possible null values to be safe
  const users = (await Promise.all(userPromises)).filter((user) =>
    Boolean(user),
  );

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
  const template = await fetchAsset('assets/templateWithLogos.pkpass', env);

  const yearString = (user: User) => {
    switch (user.year) {
      case 'first':
        return 'Fyrsta ár';
      case 'second':
        return 'Annað ár';
      case 'third':
        return 'Þriðja ár';
      default:
        return '-';
    }
  };

  const aux = user.isInEconomics
    ? [
        {
          key: 'year',
          label: 'Námsár',
          value: yearString(user),
        },
      ]
    : [];

  const zip = await generatePass(
    template,
    {
      organizationName: 'Ökonomía',
      backgroundColor: 'rgb(248,243,243)',
      foregroundColor: 'rgb(3,3,3)',
      // logoText: 'Ökonomía',
      generic: {
        primaryFields: [
          {
            key: 'member',
            label: 'Nafn',
            value: user.name,
          },
        ],
        secondaryFields: [...aux],
        auxiliaryFields: [
          {
            key: 'memberSince',
            label: 'Gildistími',
            value: 'Ágúst 2021 - Júlí 2022',
          },
        ],
        // backFields: [
        //   {
        //     key: 'info',
        //     label: 'Afslættir',
        //     value:
        //       'Þetta kort veitir þér afslætti á drykkjum á eftirfarandi stöðum: \n • Sæta Svínið - 20% \n • Jólahúsið Akureyri - 20%',
        //   },
        // ],
      },
      serialNumber: user.id,
      formatVersion: 1,
      description: 'Membership card for Ökonomía',
      passTypeIdentifier: 'pass.skirteini.okonomia.hi.is',
      teamIdentifier: 'L5TEPZ8S7Z',
      barcodes: [
        {
          format: 'PKBarcodeFormatPDF417',
          message: user.id,
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

export const sendUserPass: APIRequestHandler = async (request, env) => {
  try {
    await validateSession(request, env);
  } catch (e) {
    return new Response('Unauthorized', {
      status: 401,
      statusText: 'Unauthorized',
      headers: {
        'X-Reason': e,
      },
    });
  }

  const id = request.params?.id;
  if (!id) return API400();

  const user = await UserStore(env).get(id);
  if (!user) return API400();

  await sendPass(user, env);

  const updatedUser = {
    ...user,
    hasReceivedPass: true,
  };
  await UserStore(env).put(id, updatedUser);

  return APIResponse({
    data: {
      success: true,
    },
  });
};
