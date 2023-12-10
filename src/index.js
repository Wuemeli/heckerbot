require('dotenv').config();
const ExtendedClient = require('./class/ExtendedClient');
const { handling } = require('./functions/errorHandler');
const server = require('./express/server.js');
const {log} = require('./functions/index');
const topgg = require('./functions/top.gg');

const client = new ExtendedClient();

client.start();
log('Client Started.', 'done');
server.start(client);
topgg(client);

module.exports = { client };

global.handle = new handling(client);

process.on('unhandledRejection', console.error);
process.on('uncaughtException', console.error);
process.on('uncaughtExceptionMonitor', console.error);
process.on('warning', console.error);