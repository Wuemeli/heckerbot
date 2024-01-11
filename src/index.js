require.dotenv = require('dotenv').config();
const ExtendedClient = require('./class/ExtendedClient');
const { handling } = require('./functions/functions/errorHandler');
const { logging } = require('./functions/functions/log');
const server = require('./express/server.js');
const { log } = require('./functions/functions/consolelog');
const { default: topgg } = require('./functions/functions/top.gg');
const { handleEntitlements } = require('./functions/custom-bot/premium');
const editStatsEmbed = require('./functions/functions/statsEmbed').default;
const { sendtodev } = require('./functions/functions/sendtodev');

const client = new ExtendedClient();

setInterval(editStatsEmbed, 1000 * 60, client);
setInterval(handleEntitlements, 1000 * 60 );

try {
  client.start();
  log('Client Started.', 'done');
} catch (error) {
  console.error('Error during client.start() or log():', error);
}

try {
  server.start(client);
} catch (error) {
  console.error('Error during server.start', error);
}


module.exports = { client };

topgg(client);

global.handle = new handling(client);
global.sendtodev = new sendtodev(client);

global.log = new logging();

global.log.startuplog('Started normal bot');

process.on('unhandledRejection', (reason) => global.log.anticrashlog('unhandledRejection', reason));
process.on('uncaughtException', (reason) => global.log.anticrashlog('uncaughtException', reason));
process.on('uncaughtExceptionMonitor', (reason) => global.log.anticrashlog('uncaughtExceptionMonitor', reason));
process.on('warning', (reason) => global.log.anticrashlog('warning', reason));