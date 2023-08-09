import * as redis from 'redis';
import { RedisClient, Callback } from 'redis';
import { CacheKey } from './types';

class RClient {
  private instance?: RedisClient;
  private cache: {[key in CacheKey]?: any}

  constructor() {
    this.instance = this.create();
    this.cache = {};
  }

  create(): RedisClient {
    let ins: RedisClient = this.instance!;
    if (!this.instance) {
      ins = redis.createClient();
    }
    return ins;
  }

  getInstance(): RedisClient {
    return this.create();
  }

  onError(fn?: (channel?: string, message?: string) => void) {
    this.instance!.on('message', (channel, message) => {
      fn && fn(channel, message)
    })
  }

  setKey(key: CacheKey, value: string) {
    this.cache[key] = value
  }

  getKey(key: CacheKey, cb?: Callback<string | null>) {
    // cb params: reply is null when the key is missing
    return this.cache[key]
  }

  close() {
    this.instance!.end();
    this.instance = undefined;
    this.cache = {};
  }

}

const rClient = new RClient();

export default rClient;