const { Client, Partials, Collection, GatewayIntentBits } = require('discord.js');
const config = require('../config');
const commands = require('../handlers/commands');
const events = require('../handlers/events');
const deploy = require('../handlers/deploy');
const mongoose = require('../handlers/mongoose');
const components = require('../handlers/components');
const log = require('../functions/index');

module.exports = class extends Client {
  constructor() {
    super({
      intents: Object.values(
        {
          intents: 3276543,
        },
      ),
      partials: [Object.keys(Partials)],
    });

    this.collection = {
      interactioncommands: new Collection(),
      aliases: new Collection(),
      components: {
        buttons: new Collection(),
        selects: new Collection(),
        modals: new Collection(),
      },
    };

    this.applicationcommandsArray = [];
  }

  async start() {
    commands(this);
    events(this);
    components(this);

    mongoose();

    await this.login(process.env.CLIENT_TOKEN);

    if (config.handler.deploy) deploy(this, config);
  };
};