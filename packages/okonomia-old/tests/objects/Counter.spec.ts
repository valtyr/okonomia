import { getMiniflareTestInterface } from '../utils.js';

const test = getMiniflareTestInterface();

test('Server is up', async t => {
  try {
    const ns = await t.context.mf.getDurableObjectNamespace('COUNTER');
    const stub = ns.get(ns.newUniqueId());

    const doRes = await stub.fetch('http://localhost:8787/');
    const data = await doRes.json();

    t.deepEqual(data, { value: 0 });
  } catch (e) {
    console.log(e.stack);
  }
});
