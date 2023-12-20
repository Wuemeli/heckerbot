const {REST, Routes} = require('discord.js');
const {log} = require('../functions');

/**
 *
 * @param {ExtendedClient} client
 */
module.exports = async (client, token, clientId) => {
  const rest = new REST({ version: '10' }).setToken(token);

  try {
    log('Started loading application commands... (this might take minutes!)', 'warn');

    const enabledCommands = client.applicationcommandsArray.filter(
      command => command.options && command.options.category && process.env[command.options.category.toUpperCase()] !== 'false',
    );

    await rest.put(Routes.applicationCommands(clientId), {
      body: enabledCommands,
    });

    log('Successfully loaded application commands to Discord API.', 'done');
  } catch (e) {
    log('Unable to load application commands to Discord API.', 'err');
    log(e, 'err'); // Log the error message
  }
};