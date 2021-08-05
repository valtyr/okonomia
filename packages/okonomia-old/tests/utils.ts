import anyTest, { ExecutionContext, TestInterface } from 'ava';
import { Miniflare } from 'miniflare';

export const miniflareSetup = (t: ExecutionContext) => {
  // Create a new Miniflare environment for each test
  const mf = new Miniflare({
    // We don't want to rebuild our worker for each test, we're already doing
    // it once before we run all tests in package.json, so disable it here.
    // This will override the option in wrangler.toml.
    buildCommand: undefined,
    durableObjectsPersist: false,
  });
  t.context = { mf };
};

export type MiniflareTestInterface = TestInterface<{ mf: Miniflare }>;

export const getMiniflareTestInterface = () => {
  const test = anyTest as MiniflareTestInterface;
  test.beforeEach(miniflareSetup);

  return test;
};

export class NotImplementedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotImplementedError';
  }
}
