import { Client, Intents, Partials, Collection } from 'discord.js';
import * as commands from '../handlers/commands';
import * as events from '../handlers/events';
import * as deploy from '../handlers/deploy';
import * as mongoose from '../handlers/mongoose';
import * as components from '../handlers/components';
import { handleLogs } from '../functions/functions/handleLogs';
import { checkReminders, dailyBackup } from '../functions/functions/interval';

interface Bots {
  [clientId: string]: Client;
}

const bots: Bots = {};

export default class ExtendedClient extends Client {
  private token: string | undefined;
  private clientId: string | undefined;

  private collection: {
    interactioncommands: Collection<string, any>;
    aliases: Collection<string, any>;
    components: {
      buttons: Collection<string, any>;
      selects: Collection<string, any>;
      modals: Collection<string, any>;
    };
  };

  public applicationcommandsArray: Array<any>;

  constructor(token?: string, clientId?: string) {
    super({
      intents: Object.values(Intents),
      partials: Object.keys(Partials),
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