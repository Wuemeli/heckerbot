import { REST, Routes } from 'discord.js';
import { log } from '../functions/functions/consolelog';

/**
 * Loads application commands to Discord API.
 * @param client The Discord client instance.
 * @param token The bot's token.
 * @param clientId The ID of the application.
 */

export default async (client: any, token: string, clientId: string) => {
  const rest = new REST({ version: '10' }).setToken(token);

  try {
    log('Started loading application commands... (this might take minutes!)', 'warn');

    await rest.put(Routes.applicationCommands(clientId), {
      body: client.applicationcommandsArray,
    });

    log('Successfully loaded application commands to Discord API.', 'done');
  } catch (e) {
    console.error(e);
    log('Unable to load application commands to Discord API.', 'err');
  }
};