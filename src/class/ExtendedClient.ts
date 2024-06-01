import { Client, Partials, Collection } from 'discord.js';
import commands from '../handlers/commands';
import events from '../handlers/events';
import deploy from '../handlers/deploy';
import mongoose from '../handlers/mongoose';
import components from '../handlers/components';
import handleLogs from '../functions/functions/handleLogs';
import { checkReminders, dailyBackup } from '../functions/functions/interval';

interface Bots {
  [clientId: string]: Client;
}

const bots: Bots = {};

export default class ExtendedClient extends Client {
  public applicationcommandsArray: Array<any>;

  constructor(token?: string, clientId?: string) {
    super({
      partials: [Partials.User, Partials.Message, Partials.Channel, Partials.GuildMember],
      intents: 3276543,
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

  async start(): Promise<void> {
    commands(this);
    events(this);
    components(this);
    handleLogs(this);
    checkReminders(this);
    dailyBackup(this);

    mongoose();

    await this.login(this.token);
    deploy(this, this.token, this.clientId);

    bots[this.clientId] = this;
  }
}

export { ExtendedClient };
