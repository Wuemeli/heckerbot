const {readdirSync} = require('fs');
const {log} = require('../functions');

/**
 *
 * @param {ExtendedClient} client
 */
module.exports = (client) => {
  for (const type of readdirSync('./src/commands/')) {
    for (const dir of readdirSync('./src/commands/' + type)) {
      for (const file of readdirSync('./src/commands/' + type + '/' + dir).filter((f) => f.endsWith('.js'))) {
        const module = require('../commands/' + type + '/' + dir + '/' + file);

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
