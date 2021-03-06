import * as mongoose from 'mongoose';
import {MongoQuery} from './MongoQuery';

export class MongoCreate<T extends mongoose.Document> implements MongoQuery<T> {
  public readonly options: Record<string, any>;
  private readonly model: mongoose.Model<T>;

  public constructor(options: Record<string, any> | Record<string, any>[], model: mongoose.Model<T>) {
    this.options       = options;
    this.model         = model;
  }

  public execute(): Promise<T> {
    return this.model.create(this.options);
  }
}