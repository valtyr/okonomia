import { JwtPayload } from '@cfworker/jwt';
import { Router } from 'itty-router';
import { fetchAsset } from './lib/assets';
import { validateSession } from './lib/auth';
import { UserStore } from './lib/kv';
import generatePass from './lib/pass';
import { log } from './lib/sentry';
import { getJpeg, getPng, uploadImage } from './routes/images';
import {
  allUsers,
  createUser,
  deleteUser,
  demoteUserToMember,
  idForUser,
  promoteUserToAdmin,
  watchUsers,
} from './routes/user';

// START DURABLE OBJECTS
export { default as UserWatcher } from './lib/do/UserWatcher';
// END DURABLE OBJECTS

const router = Router({
  base: '/api',
});

export type AugmentedEnvironment = Env & {
  kv: { users: ReturnType<typeof UserStore> };
};

// User routes
router.get('/users', allUsers);
router.get('/users/watch', watchUsers);
router.post('/user/create', createUser);
router.delete('/user/:id', deleteUser);
router.put('/user/:id/admin', promoteUserToAdmin);
router.delete('/user/:id/admin', demoteUserToMember);
router.get('/user/pass/:id', idForUser);

// Image routes
router.put('/dp/upload', uploadImage);
router.get('/dp/:id', getJpeg);
router.get('/dp/png/:id', getPng);

// Index route
router.get('/', async (r: Request) => {
  const cloudflareInfo = (r as Request).cf || { time: new Date() };

  let session: JwtPayload | null = null;
  try {
    session = await validateSession(r);
    // eslint-disable-next-line no-empty
  } catch (e) {}

  const document = `
    <h3 style="font-family: monospace;">Ökonomía API 🐑</h3>
    <small style="font-family: monospace; margin-bottom: 20px; display: block;"><em>Revision:</em> <strong>${GIT_HASH}</strong></small>

    <details>
      <summary style="font-family: monospace; font-weight: 600; cursor: pointer;">
        CF request info
      </summary>
      <pre style="font-size: 10px;">${JSON.stringify(
        cloudflareInfo,
        undefined,
        2,
      )}</pre>
    </details>
    ${
      session
        ? `<details>
      <summary style="font-family: monospace; font-weight: 600; cursor: pointer;">
        Session info
      </summary>
      <pre style="font-size: 10px;">${JSON.stringify(
        session,
        undefined,
        2,
      )}</pre>
    </details>`
        : ''
    }
  `;

  return new Response(document, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
});

router.get(
  '*',
  () => new Response('404 Not found', { status: 404, statusText: 'Not found' }),
);

export default {
  async fetch(req: Request, env: Env) {
    const augmentedEnvironment: AugmentedEnvironment = {
      ...env,
      kv: {
        users: UserStore(env),
      },
    };

    try {
      return await router.handle(req, augmentedEnvironment);
    } catch (e) {
      if (env.ENVIRONMENT === 'dev') {
        throw e;
      }

      // Log error
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      log(e as any, req);
      console.error(`ENV: ${JSON.stringify(Object.keys(env))}`);

      return new Response('Unexpected error', {
        status: 500,
        statusText: 'Server error',
      });
    }
  },
};
