import ExtendedClient from '../../class/ExtendedClient';
import custombotSchema from '../../schemas/custombotSchema.js';

function createBot(token?: string, clientId?: string) {
  const client = new ExtendedClient(token, clientId);
  client.start();
  return client;
}

async function startallBots() {
  try {
    const custombots = await custombotSchema.find();
    custombots.forEach((custombot: { token: string, clientId: string }) => {
      createBot(custombot.token, custombot.clientId);
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

export { createBot, startallBots, clientIdInfo };