import { readdirSync } from 'fs';
import { log } from '../functions/functions/log';

/**
 *
 * @param {Discord.Client} client
 */
export default (client: any) => {
  for (const type of readdirSync('./src/commands/')) {
    for (const dir of readdirSync(`./src/commands/${type}`)) {
      for (const file of readdirSync(`./src/commands/${type}/${dir}`).filter((f: string) => f.endsWith('.js'))) {
        let module: any;
        try {
          module = require(`../commands/${type}/${dir}/${file}`);
        } catch (error) {
          console.error(`Error loading command ${file}:`, error);
          continue;
        }

        if (!module) continue;

        if (!module.structure?.name || !module.run) {
          log('Unable to load the command ' + file + ' due to missing \'structure#name\' or/and \'run\' properties.', 'warn');

          continue;
        }

        client.collection.interactioncommands.set(module.structure.name, module);
        client.applicationcommandsArray.push(module.structure);
        log('Loaded new command: ' + file, 'info');
      }
    }
  }
};