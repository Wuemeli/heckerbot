import dotenv from 'dotenv';
dotenv.config();

import { ExtendedClient } from './class/ExtendedClient';
import { handling } from './functions/functions/errorHandler';
import server from './express/server';
import { log } from './functions/functions/consolelog';
import topgg from './functions/functions/top.gg';
import { scheduleJobs } from './functions/functions/cron';

const client = new ExtendedClient();

try {
  client.start();
  log('Client Started.', 'done');
} catch (error) {
  global.log.anticrashlog('client.start', error);
}

try {
  server.start(client);
} catch (error) {
  global.log.anticrashlog('server.start', error);
}

topgg(client);
scheduleJobs(client);
global.handle = new handling(client);
global.log = new logging();

log('Bot Started.', 'done');

process.on('unhandledRejection', (reason) => console.error(reason));
process.on('uncaughtException', (reason) => console.error(reason));
process.on('uncaughtExceptionMonitor', (reason) => console.error(reason));
process.on('warning', (reason) => console.warn(reason));

export { client };