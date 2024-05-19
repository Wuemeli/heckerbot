import dotenv from 'dotenv';
dotenv.config();

import { ExtendedClient } from './class/ExtendedClient.js';
import { handling } from './functions/functions/errorHandler.js';
import { logging } from './functions/functions/log.js';
import server from './express/server.js';
import { consolelog } from './functions/functions/consolelog.js';
import { topgg } from './functions/functions/top.gg.js';
import { scheduleJobs } from './functions/functions/cron.js';

const client = new ExtendedClient();

try {
  client.start();
  consolelog('Client Started.', 'done');
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

consolelog('Started normal bot');

process.on('unhandledRejection', (reason) => global.log.anticrashlog('unhandledRejection', reason));
process.on('uncaughtException', (reason) => global.log.anticrashlog('uncaughtException', reason));
process.on('uncaughtExceptionMonitor', (reason) => global.log.anticrashlog('uncaughtExceptionMonitor', reason));
process.on('warning', (reason) => global.log.anticrashlog('warning', reason));

export { client };