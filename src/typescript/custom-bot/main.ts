import ExtendedClient from '../../class/ExtendedClient';
import custombotSchema from '../../schemas/custombotSchema.js';
import { codeError } from '../functions/errorHandler';

export let bots: Record<string, any> = {};

function createBot(token?: string, clientId?: string) {
  const client = new ExtendedClient(token, clientId);
  client.start();
  return client;
}

async function startallBots() {
  try {
    const custombots = await custombotSchema.find({ online: true });
    custombots.forEach((custombot: { token: string, clientId: string }) => {
      const bot = createBot(custombot.token, custombot.clientId);
      bots[custombot.clientId] = bot;
    });
  } catch (err) {
    codeError(err as Error, 'src/typescript/custom-bot/main.ts');
  }
}

async function botInfo(clientId: string) {
  try {
    const check = await custombotSchema.findOne({ clientId: clientId });
    if (check) {
      return { status: check.status, userId: check.userId };
    } else {
      return false;
    }
  }
  catch (err) {
    codeError(err as Error, 'src/typescript/custom-bot/main.ts');
  }
}

export { createBot, startallBots, botInfo };