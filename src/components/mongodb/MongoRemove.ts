import * as mongoose from 'mongoose';
import {MongoQuery} from './MongoQuery';

export class MongoRemove<T extends mongoose.Document> implements MongoQuery<T | null> {
  public readonly options: Partial<T>;
  private readonly model: mongoose.Model<T>;

  public constructor(options: Partial<T>, model: mongoose.Model<T>) {
    this.options       = options;
    this.model         = model;
  }

  public async execute(): Promise<T | null> {
    return await this.model.findOneAndRemove(this.options).exec();
  }
}