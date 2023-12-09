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
  case 'purpleskull':
    m.client.party.me.setOutfit('CID_030_Athena_Commando_M_Halloween', [{ channel: 'ClothingColor', variant: 'Mat1' }]);
    m.reply('Set the skin to Purple Skull Trooper!');
    break;
  case 'pinkghoul':
    m.client.party.me.setOutfit('CID_029_Athena_Commando_F_Halloween', [{ channel: 'Material', variant: 'Mat3' }]);
    m.reply('Set the skin to Pink Ghoul Trooper!');
    break;
  case 'chunlimode':
    m.client.party.hideMembers(true);
    m.client.party.me.setOutfit('CID_028_Athena_Commando_M_ChunLi', [{ channel: 'Material', variant: 'Mat1' }]);
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

async function startBot(botId) {
  console.log(`Starting Fortnite Bot ${botId}...`);
  const data = await fnbot.findOne({ botId: botId });
  if (!data) return;

  const fnbotdada = createClient(data.authcode, data.status, data.platform, 'CID_028_Athena_Commando_M_ChunLi', 'BID_001_ChunLi', 'Pickaxe_Lockjaw', 999, 'otherbanner28', 'defaultcolor28');
  console.log(`Started Fortnite Bot ${botId}!`);
  fnbotdada.on('party:member:message', handleCommand);
  fnbotdada.on('friend:message', handleCommand);
}

async function createBot(ownerId, authcode, status, platform) {
  const botId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

  const newfnbot = new fnbot({
    ownerId: ownerId,
    botId: botId,
    authcode: authcode,
    status: status,
    platform: platform,
  });
  await newfnbot.save();
  startBot(botId);
}

function createClient(auth, status, platform, cid, bid, pid, lvl, banner, bannercolor) {
  console.log('1');
  const fnbot = new Client({
    'defaultStatus': status,
    'platform': platform,
    'cachePresences': false,
    'auth': auth,
    'partyConfig': {
      'joinConfirmation': false,
      'joinability': 'OPEN',
      'maxSize': 16,
      'chatEnabled': true,
    },
    'debug': false,
  });

  fnbot.setLoadout = () => {
    fnbot.party.hideMembers(false);
    fnbot.party.me.setReadiness(false);
    fnbot.party.me.setOutfit(cid);
    fnbot.party.me.setBackpack(bid);
    fnbot.party.me.setPickaxe(pid);
    fnbot.party.me.setLevel(lvl);
    fnbot.party.me.setBanner(banner, bannercolor);
    fnbot.party.me.clearEmote();
  };

};

module.exports = {
  createBot,
  startBot,
};
