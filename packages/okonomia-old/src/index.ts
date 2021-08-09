import { Router } from 'itty-router';
import { Request as CloudflareRequest } from 'miniflare';
import { UserStore } from './lib/kv';
import { generateZip } from './lib/pass/zip';
import { allUsers, createUser } from './routes/user';

const router = Router();

export type AugmentedEnvironment = Env & {
  kv: { users: ReturnType<typeof UserStore> };
};

// User routes
router.get('/users', allUsers);
router.post('/user/create', createUser);

// Test routes
router.get('/zip', async (request: Request, env: AugmentedEnvironment) => {
  const zip = await generateZip();
  return new Response(zip, {
    headers: {
      'Content-Type': 'application/zip',
    },
  });
});

// Index route
router.get('/', r => {
  const cloudflareInfo = (r as CloudflareRequest).cf || { time: new Date() };

  const document = `
    <h3 style="font-family: monospace;">Ökonomía API 🐑</h3>
    <pre style="font-size: 10px;">${JSON.stringify(
      cloudflareInfo,
      undefined,
      2,
    )}</pre>
  `;

  return new Response(document, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
});

export default {
  async fetch(req: CloudflareRequest, env: Env) {
    const augmentedEnvironment: AugmentedEnvironment = {
      ...env,
      kv: {
        users: UserStore(env),
      },
    };

    try {
      return await router.handle(req, augmentedEnvironment);
    } catch (e) {
      console.log(e);
    }
  },
};
