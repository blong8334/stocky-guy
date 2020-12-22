import * as https from 'https';
import Logger from './logger';
import { tGenericObject } from './typings'

const logger = new Logger(__filename);

export function request(params: tGenericObject, options?: tGenericObject): Promise<{ results: string; headers: any }> {
  if (!options) {
    options = {};
  }
  return new Promise((resolve, reject) => {
    const req = https.request(params, (res: { [key: string]: any }) => {
      logger.info('statusCode:', res.statusCode);
      logger.info('headers:', res.headers);
      let results = '';
      res.on('data', (data: string) => {
        logger.info('RECEIVING DATA');
        results += data;
      });
      res.on('end', (data: string) => {
        results += (data || '');
        const returnResults = { results, headers: null };
        if (options.returnHeaders) {
          returnResults.headers = res.headers;
        }
        resolve(returnResults);
        logger.info('REQUEST FINISHED');
      });
    });
    req.on('error', (err) => {
      reject(err);
    });
    if (options.write) {
      req.write(options.write);
    }
    req.end();
  });
}