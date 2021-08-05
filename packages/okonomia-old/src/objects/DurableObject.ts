import { Router } from 'itty-router';
import 'reflect-metadata';

interface Env {
  COUNTER: DurableObjectNamespace;
}

abstract class DurableObject {
  state: DurableObjectState;
  router: Router = Router();

  private __initializePromise?: Promise<void>;
  private __visibleKeys: string[] = [];

  constructor(state: DurableObjectState, _env: Env) {
    this.state = state;
    this.__visibleKeys = [];

    Reflect.getMetadataKeys(this).forEach((key: string) => {
      if (key.startsWith('router:route:')) {
        const route = key.replace(/^router:route:/, '');
        this.router.get(route, Reflect.getMetadata(key, this));
      }
      if (key.startsWith('serializer:visible:')) {
        const parameterKey = key.replace(/^serializer:visible:/, '');
        this.__visibleKeys.push(parameterKey);
      }
    });
  }

  get fields(): string[] {
    let fields = [];
    let target = Object.getPrototypeOf(this);
    while (target != Object.prototype) {
      let childFields = Reflect.getOwnMetadata('fields', target) || [];
      fields.push(...childFields);
      target = Object.getPrototypeOf(target);
    }
    return fields;
  }

  abstract initialize(): Promise<void>;

  async fetch(request: Request) {
    if (!this.__initializePromise) {
      try {
        this.__initializePromise = this.initialize();
      } catch (e) {
        this.__initializePromise = undefined;
        throw e;
      }
    }

    return await this.router.handle(request);
  }

  serialize() {
    const entries: [string, unknown][] = this.fields.map(key => [
      key,
      this[key as keyof this],
    ]);
    return JSON.stringify(Object.fromEntries(entries));
  }
}

export function Route(path: string) {
  return function(
    target: DurableObject,
    _key: string | symbol,
    descriptor: PropertyDescriptor,
  ) {
    Reflect.defineMetadata(
      `router:route:${path}`,
      async () => {
        descriptor.value();
        const serialized = Reflect.apply(target.serialize, target, [target]);
        return new Response(serialized);
      },
      target,
    );

    // target.router.get(path, async () => {
    //   descriptor.value();
    //   return new Response(target.serialize());
    // });
  };
}

export function Field(): PropertyDecorator {
  return (target, key) => {
    const fields = Reflect.getOwnMetadata('fields', target) || [];
    if (!fields.includes(key)) {
      fields.push(key);
    }
    Reflect.defineMetadata('fields', fields, target);
  };
}

export default DurableObject;
