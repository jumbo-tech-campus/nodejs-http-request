/* istanbul ignore file */
import * as hapi from 'hapi';
import Boom from 'boom';
import * as Logger from 'bunyan';
import {StatsD} from 'hot-shots';
import * as vision from 'vision';
import * as inert from 'inert';
import {hapiRequestMeasurer} from './hapiRequestMeasurer';
import {createRequestErrorLog} from './createRequestErrorLog';
import {nginxRequestIDPlugin} from './nginxRequestIDPlugin';

const hapiSwagger = require('hapi-swagger');

export interface JumboHapiConfiguration {
  fqdn: string;
  server: string;
  port: string;
  validationErrorWithDescription: boolean;
  baseURL: string;
  appName: string;
  appVersion: string;
}

export class JumboHapiServer {
  public readonly server: hapi.Server;
  private readonly logger: Logger;
  private readonly statsD: StatsD;
  private readonly config: JumboHapiConfiguration;
  private readonly plugins: hapi.ServerRegisterPluginObject<any>[];

  public constructor(logger: Logger,
                     statsD: StatsD,
                     config: JumboHapiConfiguration,
                     plugins: hapi.ServerRegisterPluginObject<any>[] = []) {
    this.logger  = logger;
    this.statsD  = statsD;
    this.config  = config;
    this.plugins = plugins;

    this.server = this.createServer();
  }

  public async start(): Promise<void> {
    await this.registerHapiPlugins();

    try {
      await this.server.start();
    } catch (error) {
      this.logger.error({
        error: error,
      }, 'Error starting Hapi');

      throw error;
    }

    this.logger.info({
      host: this.config.server,
      port: this.config.port,
    }, 'Service started');

    process.on('SIGINT', async () => {
      await this.server.stop({timeout: 10000});

      this.logger.info('Service stopped');
    });
  }

  private createServer(): hapi.Server {
    return new hapi.Server({
      address: this.config.server,
      port:    this.config.port,
      routes:  {
        validate: {
          failAction: async (request, h, error) => {
            if (!error) {
              return h.continue;
            }

            this.logger.warn(createRequestErrorLog(request, error), 'Input validation failed');
            if (this.config.validationErrorWithDescription) {
              throw error;
            }

            throw Boom.badRequest('Invalid request payload input');
          },
        },
      },
    });
  }

  private async registerHapiPlugins(): Promise<void> {
    await this.server.register([
      {
        plugin: nginxRequestIDPlugin,
      },
      {
        plugin:  hapiSwagger,
        options: {
          info:              {
            'title':   this.config.appName,
            'version': this.config.appVersion,
          },
          host:              this.config.fqdn,
          jsonPath:          `${this.config.baseURL}/swagger.json`,
          documentationPath: `${this.config.baseURL}/documentation`,
          swaggerUIPath:     `${this.config.baseURL}/swaggerui/`,
          grouping:          'tags',
        },
      },
      {
        plugin:  hapiRequestMeasurer,
        options: {
          statsdClient: this.statsD,
        },
      },
    ]);

    await this.server.register([inert, vision]);

    if (this.plugins.length > 0) {
      await this.server.register(this.plugins);
    }
  }
}