require('dotenv').config();
const ExtendedClient = require('./class/ExtendedClient');
const Errorhandler = require('./functions/errorHandler');
const server = require('./express/server.js');

const client = new ExtendedClient();

client.start();
server.start(client);

module.exports = { client };

global.handle = new Errorhandler(client);

process.on('unhandledRejection', console.error);
process.on('uncaughtException', console.error);
process.on('uncaughtExceptionMonitor', console.error);
process.on('warning', console.error);