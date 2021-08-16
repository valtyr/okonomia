import { NotImplementedError } from './utils.js';

type DurableObjectInnerStorage<T = unknown> = Map<string, T>;
export class DurableObjectOperatorMock implements DurableObjectOperator {
  private storage: DurableObjectInnerStorage = new Map<string, unknown>();

  async get<T = unknown>(key: string): Promise<T>;
  async get<T = unknown>(keys: Array<string>): Promise<Map<string, T>>;
  async get(keyOrKeys: string | Array<string>): Promise<any> {
    if (typeof keyOrKeys === 'string') {
      return this.storage.get(keyOrKeys);
    }
    const obj = keyOrKeys.reduce(
      (prev, cur) => ({
        ...prev,
        ...(this.get(cur) ? { [cur]: this.get(cur) } : {}),
      }),
      {} as DurableObjectInnerStorage,
    );
    return new Map(Object.entries(obj));
  }

  async put<T = unknown>(key: string, value: T): Promise<void>;
  async put<T = unknown>(
    entries: DurableObjectEntries<T>,
    _?: never,
  ): Promise<void>;
  async put<T = unknown>(
    keyOrEntries: string | DurableObjectEntries<T>,
    value: T,
  ): Promise<void> {
    if (typeof keyOrEntries === 'string') {
      this.storage.set(keyOrEntries, value);
      return;
    }

    this.storage = new Map([...this.storage, ...Object.entries(keyOrEntries)]);
  }

  async delete(key: string): Promise<boolean>;
  async delete(keys: Array<string>): Promise<number>;
  async delete(keyOrKeys: string | Array<string>): Promise<any> {
    if (typeof keyOrKeys === 'string') {
      return this.storage.delete(keyOrKeys);
    }

    let nDeleted = 0;
    keyOrKeys.forEach(key => {
      if (this.storage.delete(key)) nDeleted++;
    });
  }

  async deleteAll(): Promise<void> {
    this.storage.clear();
  }

  async list<T = unknown>(
    options?: DurableObjectListOptions,
  ): Promise<Map<string, T>> {
    const entries = Object.entries(this.storage);
    entries.sort(([ak], [bk]) => ak.localeCompare(bk));

    if (!options) return new Map(entries);

    let startIndex = 0;
    if (options?.start) {
      const idx = entries.findIndex(([k]) => k === options.start);
      startIndex = idx !== -1 ? idx : startIndex;
    }

    let endIndex = entries.length;
    if (options && Boolean(options?.end)) {
      const idx = entries.findIndex(([k]) => k === options.end);
      endIndex = idx !== -1 ? idx : endIndex;
    }

    const limitedEntries = entries.slice(startIndex, endIndex);

    const filteredEntries =
      typeof options.prefix !== 'undefined'
        ? limitedEntries.filter(([k]) => k.startsWith(options.prefix!))
        : limitedEntries;

    if (options.reverse) filteredEntries.reverse();
    if (options.limit) return new Map(filteredEntries.slice(0, options.limit));

    return new Map(filteredEntries);
  }
}

export class DurableObjectTransactionMock extends DurableObjectOperatorMock
  implements DurableObjectTransaction {
  rollback() {
    throw new NotImplementedError('This method has not been implemented 🤠');
  }
}

export class DurableObjectStorageMock extends DurableObjectOperatorMock
  implements DurableObjectStorage {
  async transaction(
    _closure: (txn: DurableObjectTransaction) => Promise<void>,
  ): Promise<void> {
    throw new NotImplementedError('This method has not been implemented 🤠');
  }
}

export class StateMock {
  public id: string;
  public storage: DurableObjectStorage = new DurableObjectStorageMock();

  constructor(id?: string) {
    this.id = id || 'TEST_ID';
  }

  async waitUntil(_promise: Promise<any>) {
    throw new NotImplementedError('This method has not been implemented 🤠');
  }
}
