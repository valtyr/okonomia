import { Router } from 'itty-router';

const router = Router();

router.get(
  '/',
  () =>
    new Response('Counter API 🧮', {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    }),
);

router.get('/counter/:id', async (request, env: Env) => {
  const obj = env.COUNTER.get(request.params?.id!);

  const url = new URL(request.url);
  url.pathname = '/';

  const resp = await obj.fetch(url.toString());
  const state = await resp.json();
  new Response(state);
});

export default {
  async fetch(req: Request, env: Env) {
    return router.handle(req, env);
  },
};

// Export Durable Objects
export { default as Counter } from './objects/Counter';
