require('dotenv').config();
const config = require('./config.js');
if (config.dotenv.enabled) {
  require('dotenv').config({ DOTENV_KEY: 'ENVKEY' });
}

const ExtendedClient = require('./class/ExtendedClient');
const { handling } = require('./typescript/functions/errorHandler');
const server = require('./express/server.js');
const { log } = require('./functions/index');
const { default: topgg } = require('./typescript/functions/top.gg');
const handleLogs = require('./typescript/functions/handleLogs').default;
const { startallBots } = require('./typescript/custom-bot/main');

const client = new ExtendedClient();

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

try {
  startallBots();
} catch (error) {
  console.error('Error during startingsubbots');
}

module.exports = { client };

global.handle = new handling(client);

process.on('unhandledRejection', console.error);
process.on('uncaughtException', console.error);
process.on('uncaughtExceptionMonitor', console.error);
process.on('warning', console.error);

