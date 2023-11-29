const {REST, Routes} = require('discord.js');
const {log} = require('../functions');

/**
 *
 * @param {ExtendedClient} client
 */
module.exports = async (client) => {
  const rest = new REST({version: '10'}).setToken(process.env.CLIENT_TOKEN);

  try {
    log('Started loading application commands... (this might take minutes!)', 'warn');

    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
      body: client.applicationcommandsArray,
    });

    log('Successfully loaded application commands to Discord API.', 'done');
  } catch (e) {
    log('Unable to load application commands to Discord API.', 'err');
  }
};
