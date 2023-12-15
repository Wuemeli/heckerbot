require('dotenv').config();
const config = require('./config.js');
if (config.dotenv.enabled) {
  require('dotenv').config({ DOTENV_KEY: 'ENVKEY' });
}

const ExtendedClient = require('./class/ExtendedClient');
const { handling } = require('./typescript/functions/errorHandler');
const server = require('./express/server.js');
const {log} = require('./functions/index');
const { default: topgg } = require('./typescript/functions/top.gg');
const handleLogs = require('./typescript/functions/handleLogs').default;


const client = new ExtendedClient();

client.start();
log('Client Started.', 'done');
server.start(client);
topgg(client);
handleLogs(client);

module.exports = { client };

global.handle = new handling(client);

process.on('unhandledRejection', console.error);
process.on('uncaughtException', console.error);
process.on('uncaughtExceptionMonitor', console.error);
process.on('warning', console.error);