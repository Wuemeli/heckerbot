const { Client, Partials, Collection } = require('discord.js');
const commands = require('../handlers/commands');
const events = require('../handlers/events');
const deploy = require('../handlers/deploy');
const mongoose = require('../handlers/mongoose');
const components = require('../handlers/components');
const handleLogs = require('../functions/functions/handleLogs').default;
const { checkReminders, dailyBackup } = require('../functions/functions/interval');

module.exports = class ExtendedClient extends Client {
  constructor() {
    super({
      intents: Object.values({
        intents: 3276543,
      }),
      partials: [Object.keys(Partials)],
    });

    this.token = process.env.CLIENT_TOKEN;
    this.clientId = process.env.CLIENT_ID;

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
    console.log('Starting bot...');
    commands(this);
    events(this);
    components(this);
    handleLogs(this);
    checkReminders(this);
    dailyBackup(this);

    mongoose();

    await this.login(this.token);
    deploy(this, this.token, this.clientId);

  };
};