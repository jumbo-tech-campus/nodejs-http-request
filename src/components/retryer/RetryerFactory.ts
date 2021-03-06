import {Retryer} from './Retryer';
import {Retryable} from './Retryable';
import {StatsD} from 'hot-shots';

export class RetryerFactory {
  private readonly statsD: StatsD;
  private readonly maxAttempts: number;
  private readonly minInterval: number;
  private readonly maxInterval: number;
  private readonly jitter: number;
  private readonly defaultTags?: string[];

  public constructor(statsD: StatsD, maxAttempts: number, minInterval: number, maxInterval: number, jitter: number, defaultTags?: string[]) {
    this.statsD      = statsD;
    this.maxAttempts = maxAttempts;
    this.minInterval = minInterval;
    this.maxInterval = maxInterval;
    this.jitter      = jitter;
    this.defaultTags = defaultTags;
  }

  public create(retryable: Retryable): Retryer {
    return new Retryer(this.statsD, retryable, {
      maxAttempts: this.maxAttempts + 1,
      minInterval: this.minInterval,
      maxInterval: this.maxInterval,
      jitter:      this.jitter,
    }, this.defaultTags);
  }
}