const axios = require('axios');
const { Client } = require('fnbr');
const fnbot = require('../schemas/fnbotSchema');
const { codeError } = require('../functions/errorHandler');
const { handleCommand } = require('./commands');



async function refreshToken(refreshToken) {
  try {
    const response = await axios.post('https://account-public-service-prod.ol.epicgames.com/account/api/oauth/token', {
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    });

    return response.data.access_token;
  } catch (error) {
    codeError(error, 'src/fn-bot/main.js');
  }
}

async function startBot(botId) {
  try {
    console.log(`Starting Fortnite Bot ${botId}...`);
    const data = await fnbot.findOne({ botId: botId });
    if (!data) return;

    createClient(data.deviceAuth, data.status, data.platform);
    console.log(`Started Fortnite Bot ${botId}!`);
  } catch (err) {
    codeError(err, 'src/fn-bot/main.js');
  }
}

async function createBot(ownerId, authcode, status, platform) {
  try {
    const botId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    if (!authcode || typeof authcode !== 'string') {
      throw new Error('Invalid authcode');
    }
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
      startBot(botId);
    });

    await client.login();
  } catch (err) {
    codeError(err, 'src/fn-bot/main.js');
  }
}

async function createClient(deviceAuth, status, platform) {
  try {
    console.log('Creating Fortnite Bot...');
    const fnbot = new Client({
      'defaultStatus': status,
      'platform': platform,
      'auth': { deviceAuth: deviceAuth },
      'partyConfig': {
        'joinConfirmation': false,
        'joinability': 'OPEN',
        'maxSize': 16,
        'chatEnabled': true,
      },
    });

    fnbot.login().catch(async (err) => {
      console.error(`Failed to login: ${err}`);
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

  } catch (err) {
    codeError(err, 'src/fn-bot/main.js');
  }
};

module.exports = {
  createBot,
  startBot,
};