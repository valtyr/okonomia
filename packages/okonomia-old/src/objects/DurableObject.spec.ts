import test from 'ava';
import { StateMock } from '../../tests/mocks.js';

import DurableObject, { Field, Route } from './DurableObject.js';

interface Env {
  COUNTER: DurableObjectNamespace;
}

class TestObject extends DurableObject {
  @Field()
  value = 0;

  @Field()
  valid = true;

  @Field()
  name = 'Valtýr Örn';

  async initialize() {
    const value = await this.state.storage.get<number | null>('value');
    this.value = value || 0;
  }

  @Route('/')
  async read() {}

  @Route('/increment')
  async increment() {
    ++this.value;
    await this.state.storage.put<number>('value', this.value);
  }
}

test('Durable object has correct fields', async t => {
  const state = new StateMock();
  const object = new TestObject(state, {} as Env);
  t.deepEqual(object.fields, ['value', 'valid', 'name']);
});

test('Durable object serializes fields', async t => {
  const state = new StateMock();
  const object = new TestObject(state, {} as Env);
  t.deepEqual(JSON.parse(object.serialize()), {
    value: 0,
    valid: true,
    name: 'Valtýr Örn',
  });
});

// test('Durable object serializes fields', async t => {
//   const state = new StateMock();
//   const object = new TestObject(state, {} as Env);
// });
