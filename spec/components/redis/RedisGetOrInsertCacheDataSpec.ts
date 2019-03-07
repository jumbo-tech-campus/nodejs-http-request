import {RedisGetOrInsertCacheData} from '../../../src/components/redis/RedisGetOrInsertCacheData';
import {RedisQueryFactory} from '../../../src/components/redis/RedisQueryFactory';
import {CacheQuery} from '../../../src/components/redis/CacheQuery';

describe('A RedisGetOrInsertCacheData', () => {
  const redisQueryFactoryMock = {} as RedisQueryFactory;
  const cacheable = new RedisGetOrInsertCacheData(redisQueryFactoryMock, 3600);
  const cacheQueryMock = {} as CacheQuery<any>;

  describe('Succesfully executes', () => {
    let result: unknown;

    beforeEach(async () => {
      redisQueryFactoryMock.createGet = () => cacheQueryMock;
      cacheQueryMock.execute          = () => Promise.resolve({});

      result = await cacheable.execute('key', async (): Promise<any> => ({}));
    });

    it('Returns the result', () => {
      expect(result).toEqual({});
    });
  });
});