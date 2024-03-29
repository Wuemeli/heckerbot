import axios from 'axios';
import { Client, Platform } from 'fnbr';
import { codeError } from '../functions/errorHandler';
import { handleCommand } from './commands';
import fnbot from '../../schemas/fnbotSchema';

const bots: string[] = [];

async function refreshToken(refreshToken: string): Promise<string> {
  try {
    const response = await axios.post('https://account-public-service-prod.ol.epicgames.com/account/api/oauth/token', {
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    });

    return response.data.access_token;
  } catch (error) {
    codeError(error as Error, 'src/fn-bot/main.js');
  }
}

async function startBot(botId: string): Promise<{ name: string | null, started: boolean }> {
  try {
    const data = await fnbot.findOne({ botId: botId });
    if (!data) return { name: null, started: false };
    if (bots.includes(botId)) return { name: botId, started: true };

    createClient(data.deviceAuth, data.status, data.platform);
    bots.push(botId);
    return { name: botId, started: false };
  } catch (err) {
    codeError(err as Error, 'src/fn-bot/main.js');
  }
}

async function checkAuthCode(authcode: string): Promise<boolean> {
  try {
    const client = new Client({
      auth: { authorizationCode: authcode },
    });

    client.on('deviceauth:created', async (deviceAuth) => {
    });

    await client.logout();

    return true;
  } catch (err) {
    return false;
  }
}

async function createBot(ownerId: string, authcode: string, status: string, platform: string): Promise<{ error: boolean, botId: string }> {
  let botId = '';
  try {
    botId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    if (!status || typeof status !== 'string') {
      throw new Error('Invalid status');
    }
    if (!platform || !['WIN', 'MAC', 'IOS', 'AND', 'PSN', 'XBL', 'SWT'].includes(platform.toUpperCase())) {
      throw new Error('Invalid platform');
    }

    const client = new Client({
      auth: { authorizationCode: authcode },
    });

    client.on('deviceauth:created', async (deviceAuth) => {
      const newfnbot = new fnbot({
        ownerId: ownerId,
        botId: botId,
        deviceAuth: deviceAuth,
        status: status,
        platform: platform,
      });
      await newfnbot.save();
    });

    await client.login();

    return { error: false, botId: botId };
  } catch (err) {
    codeError(err as Error, 'src/fn-bot/main.js');
    if ((err as Error).message === 'errors.com.epicgames.account.auth_token.invalid_refresh_token') { return { error: false, botId: botId }; }
    return { error: true, botId: '' };
  }
}

async function createClient(deviceAuth: any, status: string, platform: string) {
  try {
    const fnbot = new Client({
      'defaultStatus': status,
      'platform': platform as Platform,
      'auth': { deviceAuth: deviceAuth },
      'partyConfig': {
        'joinConfirmation': false,
        'joinability': 'OPEN',
        'maxSize': 16,
        'chatEnabled': true,
      },
    });

    fnbot.login().catch(async (err) => {
      codeError(err as Error, 'src/fn-bot/main.js');
      if (err.code === 'errors.com.epicgames.account.auth_token.invalid_refresh_token') {
        const newAccessToken = await refreshToken(deviceAuth.refreshToken);
        deviceAuth.accessToken = newAccessToken;
        await fnbot.login();
      }
    });

    fnbot.on('friend:request', async (friendRequest) => {
      await friendRequest.accept();
    });

    fnbot.on('party:member:joined', async (member) => {
      fnbot.party.sendMessage(`Welcome ${member.displayName}!`);
      fnbot.party.me.setOutfit('CID_028_Athena_Commando_F');
    });

    fnbot.on('party:member:message', handleCommand);
    fnbot.on('friend:message', handleCommand);

  } catch (err) {
    codeError(err as Error, 'src/fn-bot/main.js');
  }
};

export {
  createBot,
  startBot,
};
