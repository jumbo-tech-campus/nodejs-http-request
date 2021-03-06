import * as mongoose from 'mongoose';
import {MongoQuery} from './MongoQuery';

export class MongoUpdateMany<T extends mongoose.Document> implements MongoQuery<void> {
  public readonly options: Record<string, any>;
  public readonly document: Record<string, any>;
  private readonly model: mongoose.Model<T>;

  public constructor(options: Record<string, any>, document: Record<string, any>, model: mongoose.Model<T>) {
    this.options       = options;
    this.document      = document;
    this.model         = model;
  }

  public async execute(): Promise<void> {
    await this.model.updateMany(this.options, this.document).exec();
  }
}