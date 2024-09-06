import { readdirSync } from 'fs';
import { log } from '../functions/functions/consolelog';

/**
 *
 * @param {Discord.Client} client
 */
export default (client: any) => {
  for (const type of readdirSync('./src/commands/')) {
    for (const dir of readdirSync(`./src/commands/${type}`)) {
      for (const file of readdirSync(`./src/commands/${type}/${dir}`).filter((f: string) => f.endsWith('.ts'))) {
        const module = require(`../commands/${type}/${dir}/${file}`);

        if (typeof module.default !== 'object') {
          const { structure, run } = module.default;
          if (structure && typeof run === 'function') {
            module.default.run = run;
            module.default.structure = structure;

          } else {
            log(`Unable to load the command ${file} due to missing 'structure' or 'run' properties.`, 'warn');
            continue;
          }
        }

        client.collection.interactioncommands.set(module.default.structure.name, module);
        client.applicationcommandsArray.push(module.defaultstructure);
        log('Loaded new command: ' + file, 'info');
      }
    }
  }
};