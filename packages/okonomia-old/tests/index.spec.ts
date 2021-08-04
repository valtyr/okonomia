import { getMiniflareTestInterface } from './utils.js';

const test = getMiniflareTestInterface();

test('Server is up', async t => {
  const res = await t.context.mf.dispatchFetch('http://localhost:8787/');
  t.is(await res.text(), 'Counter API 🧮');
});
