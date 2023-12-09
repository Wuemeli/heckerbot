const axios = require('axios').default;
const { Client } = require('fnbr');
const fnbot = require('../schemas/fnbotSchema');

const fetchCosmetic = async (name, type) => {
  try {
    const { data: cosmetic } = (await axios('https://fortnite-api.com/v2/cosmetics/br/search?name=${encodeURI(name)}&type=${type}')).data;
    return cosmetic;
  } catch (err) {
    return undefined;
  }
};

const handleCommand = async (m) => {
  if (!m.content.startsWith('!')) return;
  const args = m.content.slice(1).split(' ');
  const command = args.shift().toLowerCase();
  let cosmetic;

  switch (command) {
  case 'skin':
  case 'emote':
  case 'backpack':
  case 'emoji':
  case 'banner':
  case 'pickaxe':
    cosmetic = await fetchCosmetic(args.join(' '), command);
    if (cosmetic) {
      m.client.party.me[`set${command.charAt(0).toUpperCase() + command.slice(1)}`](cosmetic.id);
      m.reply(`Set the ${command} to ${cosmetic.name}!`);
    } else m.reply(`The ${command} ${args.join(' ')} wasn't found!`);
    break;
  case 'chunlimode':
    m.client.party.hideMembers(true);
    m.client.party.me.setOutfit('CID_028_Athena_Commando_M_ChunLi');
    m.client.party.me.setEmote('EID_PartyHips');
    m.reply('Have Fun (;!. If you want to stop then type the Command !default');
    break;
  case 'ready':
    m.client.party.me.setReadiness(true);
    m.reply('Ready!');
    break;
  case 'unready':
    m.client.party.me.setReadiness(false);
    m.reply('Unready!');
    break;
  case 'gift':
    m.client.party.me.clearEmote();
    m.client.party.me.setEmote('EID_NeverGonna');
    m.reply('Uhh, did you really think i was going to gift you?');
    break;
  case 'hide':
    m.client.party.hideMembers(true);
    m.reply('Hiding Members!');
    break;
  case 'unhide':
    m.client.party.hideMembers(false);
    m.reply('Unhiding Members!');
    break;
  case 'level':
    m.client.party.me.setLevel(parseInt(args[0], 10));
    m.reply(`Set your level to ${args[0]}!`);
    break;
  case 'showpickaxe':
    m.party.me.setEmote('EID_IceKing');
    m.reply('Showing Pickaxe!');
    break;
  default:
    break;
  }
};


async function refreshToken(refreshToken) {
  try {
    const response = await axios.post('https://account-public-service-prod.ol.epicgames.com/account/api/oauth/token', {
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    });

    return response.data.access_token;
  } catch (error) {
    console.error('Failed to refresh token: ', error);
  }
}

async function startBot(botId) {
  console.log(`Starting Fortnite Bot ${botId}...`);
  const data = await fnbot.findOne({ botId: botId });
  if (!data) return;

  createClient(data.deviceAuth, data.status, data.platform);
  console.log(`Started Fortnite Bot ${botId}!`);
}

async function createBot(ownerId, authcode, status, platform) {
  const botId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

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
    fnbot.on('ready', () => {
      console.log(`Created Fortnite Bot ${fnbot.user.displayName}!`);
    });

    fnbot.on('friend:request', async (friendRequest) => {
      await friendRequest.accept();
    });

    fnbot.on('party:member:joined', async (member) => {
      fnbot.party.sendMessage(`Welcome ${member.displayName}!`);
      const outfit = await fetchCosmetic(member.outfit, 'outfit');
      if (outfit) {
        fnbot.party.me.setOutfit(outfit.id, outfit.variants, outfit.enlightenment, outfit.path);
      }
    });

    fnbot.on('party:member:message', handleCommand);
    fnbot.on('friend:message', handleCommand);

  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  createBot,
  startBot,
};
