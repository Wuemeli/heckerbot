require.dotenv = require('dotenv').config();

const ExtendedClient = require('./class/ExtendedClient');
const { handling } = require('./functions/functions/errorHandler');
const { logging } = require('./functions/functions/log');
const server = require('./express/server.js');
const { log } = require('./functions/functions/consolelog');

const client = new ExtendedClient();

try {
  log('Client Starting.', 'done');
  client.start();
} catch (error) {
  global.log.anticrashlog('client.start', error);
}

try {
  server.start(client);
} catch (error) {
  global.log.anticrashlog('server.start', error);
}

module.exports = { client };

global.handle = new handling(client);
global.log = new logging();

global.log.startuplog('Started normal bot');

process.on('unhandledRejection', (reason) => global.log.anticrashlog('unhandledRejection', reason));
process.on('uncaughtException', (reason) => global.log.anticrashlog('uncaughtException', reason));
process.on('uncaughtExceptionMonitor', (reason) => global.log.anticrashlog('uncaughtExceptionMonitor', reason));
process.on('warning', (reason) => global.log.anticrashlog('warning', reason));