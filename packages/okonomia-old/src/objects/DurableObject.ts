import { Router } from 'itty-router';
import 'reflect-metadata';

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
    // console.error(this);
    // let returnObject: { [_: string]: any } = {};
    // this.__visibleKeys.forEach(key => {
    //   returnObject[key] = this[key] as any;
    // });

    // console.error(returnObject);
    return JSON.stringify(this);
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

export const Visible = <T extends DurableObject>(target: T, key: keyof T) => {
  Reflect.defineMetadata(`serializer:visible:${key}`, undefined, target);
};

export default DurableObject;
