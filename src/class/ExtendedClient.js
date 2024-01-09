const { Client, Partials, Collection } = require('discord.js');
const commands = require('../handlers/commands');
const events = require('../handlers/events');
const deploy = require('../handlers/deploy');
const mongoose = require('../handlers/mongoose');
const components = require('../handlers/components');
const handleLogs = require('../functions/functions/handleLogs').default;
const { checkReminders } = require('../functions/functions/interval');

const bots = {};
module.exports = class ExtendedClient extends Client {
  constructor(token, clientId) {
    super({
      intents: Object.values({
        intents: 3276543,
      }),
      partials: [Object.keys(Partials)],
    });

    this.token = token || process.env.CLIENT_TOKEN;
    this.clientId = clientId || process.env.CLIENT_ID;

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
    handleLogs(this);
    checkReminders(this);

    mongoose();

    await this.login(this.token);
    deploy(this, this.token, this.clientId);

    bots[this.clientId] = this;
  };
};