import { readdirSync } from 'fs';
import { log } from '../functions/functions/consolelog';

export default (client: any): void => {
  for (const dir of readdirSync('./src/events/')) {
    for (const file of readdirSync(`./src/events/${dir}`).filter((f) => f.endsWith('.ts'))) {
      const module = require(`../events/${dir}/${file}`);

      if (typeof module.default === 'object') {
        const { event, run } = module.default;
        if (event && typeof run === 'function') {
          log(`Loaded new event: ${file}`, 'info');

          if (module.once) {
            client.once(event, (...args: any[]) => run(client, ...args));
          } else {
            client.on(event, (...args: any[]) => run(client, ...args));
          }
        } else {
          log(`Unable to load the event ${file} due to missing 'event' or 'run' properties.`, 'warn');
        }
      } else {
        log(`Unable to load the event ${file} due to unexpected module structure.`, 'warn');
      }
    }
  }
};