import ExtendedClient from '../../class/ExtendedClient';
import custombotSchema from '../../schemas/custombotSchema.js';

let bots: Record<string, any> = {};

function createBot(token?: string, clientId?: string) {
  const client = new ExtendedClient(token, clientId);
  client.start();
  return client;
}

async function startallBots() {
  try {
    const custombots = await custombotSchema.find();
    custombots.forEach((custombot: { token: string, clientId: string }) => {
      const bot = createBot(custombot.token, custombot.clientId);
      bots[custombot.clientId] = bot;
    });
  } catch (err) {
    console.log(err);
  }
}


async function clientIdInfo(clientId: string) {
  try {
    const check = await custombotSchema.findOne({ clientId: clientId });
    if (check) {
      return { status: check.status, userId: check.userId };
    } else {
      return false;
    }
  }
  catch (err) {
    console.log(err);
  }
}

function stopBot(clientId: string) {
  const bot = bots[clientId];
  if (bot) {
    bot.destroy();
    delete bots[clientId];
  } else {
    return false;
  }
}
export { createBot, startallBots, clientIdInfo, stopBot };