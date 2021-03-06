import {MongoQuery} from './MongoQuery';
import {Measurable} from '../telemetry/Measurable';

export class MongoMeasurable<T> implements MongoQuery<T>, Measurable<T> {
  public readonly type: string                         = 'MongoQuery';
  private readonly mongoQuery: MongoQuery<T>;
  private result: 'success' | 'failed' | 'notexecuted' = 'notexecuted';

  public constructor(mongoQuery: MongoQuery<T>) {
    this.mongoQuery = mongoQuery;
  }

  public get name(): string {
    return this.mongoQuery.constructor.name;
  }

  public get options(): object {
    return this.mongoQuery.options;
  }

  public get tags(): string[] {
    return [
      `result:${this.result}`,
      `type:${this.name}`,
    ];
  }

  public async execute(): Promise<T> {
    try {
      const result = await this.mongoQuery.execute();

      this.result = 'success';

      return result;
    } catch (error) {
      this.result = 'failed';

      throw error;
    }
  }
}