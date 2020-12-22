import * as fs from 'fs';
import * as pathFn from 'path';
import Logger from './logger';
import * as sensitive from '../sensitive';
import { request } from './request';

const logger = new Logger(__filename);
const fileName = './results.json';

(async function () {
  try {
    const { url: { hostname, path } } = sensitive;
    const options = {
      hostname,
      path: `${path}?token=${sensitive.key}`,
      method: 'GET',
    };
    const {results} = await request(options);
    // logger.info(JSON.stringify(results, null, 2));
    fs.writeFileSync(pathFn.resolve(__dirname, fileName), results);
  } catch (error) {
    logger.error('ERROR');
    logger.error(error);
  }
  process.exit(0);
})()