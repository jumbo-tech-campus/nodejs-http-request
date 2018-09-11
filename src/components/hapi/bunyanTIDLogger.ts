import * as hapi from 'hapi';
import uuidv4 from 'uuid/v4';
import * as Logger from 'bunyan';
import Boom from 'boom';

declare module 'hapi' {
  interface ApplicationState {
    tid: string;
    logger: Logger;
  }
}

export interface BunyanHapiTIDLoggerOptions {
  logger: Logger;
}

export const createTIDLoggerLifecycleMethod = (options: BunyanHapiTIDLoggerOptions): hapi.Lifecycle.Method => (request, h) => {
  request.app.tid    = uuidv4();
  request.app.logger = options.logger.child({
    transactionID: request.app.tid,
  });

  return h.continue;
};

export const tidErrorHandler: hapi.Lifecycle.Method = (request, h) => {
  const response = request.response;

  if (response instanceof Boom) {
    response.output.headers['x-transaction-id'] = request.app.tid;

    if (response.output.statusCode >= 500) {
      request.app.logger.error({
        request: {
          path:    request.path,
          method:  request.method,
          headers: request.headers,
          query:   request.query,
          payload: request.payload,
        },
        error:   response,
      }, 'Request Error');
    }
  }

  return h.continue;
};

export const bunyanTIDLogger: hapi.Plugin<BunyanHapiTIDLoggerOptions> = {
  name:     'logging',
  register: (server, options) => {
    server.ext('onRequest', createTIDLoggerLifecycleMethod(options));
    server.ext('onPreResponse', tidErrorHandler);
  },
};