import {CacheQueryFactory} from './CacheQueryFactory';
import {Cacheable} from './Cacheable';

export class GetOrInsertCacheData {
  private cacheQueryFactory: CacheQueryFactory;
  private ttl: number;

  public constructor(cacheQueryFactory: CacheQueryFactory, ttl: number) {
    this.cacheQueryFactory = cacheQueryFactory;
    this.ttl               = ttl;
  }

  public async execute<T>(cacheableRequest: Cacheable<T>): Promise<T> {
    let cachedValue: T = await this.cacheQueryFactory.createGet(cacheableRequest.cacheKey).execute()
      .catch((error) => ({}));

    if (!cachedValue) {
      cachedValue = await cacheableRequest.execute();

      this.cacheQueryFactory.createInsert(cacheableRequest.cacheKey, cachedValue, {expiry: this.ttl})
        .execute()
        .catch((error) => ({}));
    }

    return cachedValue;
  }
}
