require('dotenv').config();
const config = require('./config.js');
if (config.dotenv.enabled) {
  require('dotenv').config({ DOTENV_KEY: 'ENVKEY' });
}

const ExtendedClient = require('./class/ExtendedClient');
const { handling } = require('./typescript/functions/errorHandler');
const { logging } = require('./typescript/functions/log');
const server = require('./express/server.js');
const { log } = require('./functions/index');
const { default: topgg } = require('./typescript/functions/top.gg');
const handleLogs = require('./typescript/functions/handleLogs').default;
const { handleEntitlements } = require('./typescript/custom-bot/premium');
const editStatsEmbed = require('./typescript/functions/statsEmbed').default;

const client = new ExtendedClient();

handleEntitlements();
editStatsEmbed(client);
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

try {
  topgg(client);
} catch (error) {
  console.error('Error during topgg', error);
}

try {
  handleLogs(client);
} catch (error) {
  console.error('Error during handleLogs', error);
}

module.exports = { client };

global.handle = new handling(client);
global.log = new logging();

global.log.startuplog('Started normal bot');

process.on('unhandledRejection', (reason) => global.log.anticrashlog('unhandledRejection', reason));
process.on('uncaughtException', (reason) => global.log.anticrashlog('uncaughtException', reason));
process.on('uncaughtExceptionMonitor', (reason) => global.log.anticrashlog('uncaughtExceptionMonitor', reason));
process.on('warning', (reason) => global.log.anticrashlog('warning', reason));