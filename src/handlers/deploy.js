const {REST, Routes} = require('discord.js');
const {log} = require('../functions');

/**
 *
 * @param {ExtendedClient} client
 */
module.exports = async (client, token, clientId) => {
  const rest = new REST({version: '10'}).setToken(token);

  try {
    log('Started loading application commands... (this might take minutes!)', 'warn');

    const env = process.env;
    
    await rest.put(Routes.applicationCommands(clientId), {
      body: client.applicationcommandsArray.filter(cmd => !cmd.options || !cmd.options.category || env[cmd.options.category.toUpperCase()] !== 'false'),
    });

    log('Successfully loaded application commands to Discord API.', 'done');
  } catch (e) {
    console.error(e);
    log('Unable to load application commands to Discord API.', 'err');
  }
};
