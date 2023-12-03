/* eslint-disable */
const { readFile, writeFile } = require('fs').promises;
const axios = require('axios').default;
const { Client } = require('fnbr');
const config = require("./config.json");

const fetchCosmetic = async (name, type) => {
  try {
    const { data: cosmetic } = (await axios(`https://fortnite-api.com/v2/cosmetics/br/search?name=${encodeURI(name)}&type=${type}`)).data;
    return cosmetic;
  } catch (err) {
    return undefined;
  }
};

const handleCommand = async (m) => {
  if (!m.content.startsWith('!')) return;
  const args = m.content.slice(1).split(' ');
  const command = args.shift().toLowerCase();
  if (command === 'skin') {
    const skin = await fetchCosmetic(args.join(' '), 'outfit');
    if (skin) {
      m.client.party.me.setOutfit(skin.id);
      m.reply(`Set the skin to ${skin.name}!`);
    } else m.reply(`The skin ${args.join(' ')} wasn't found!`);
  } else if (command === 'emote') {
    const emote = await fetchCosmetic(args.join(' '), 'emote');
    if (emote) {
      m.client.party.me.setEmote(emote.id);
      m.reply(`Set the emote to ${emote.name}!`);
    } else m.reply(`The emote ${args.join(' ')} wasn't found!`);
  } else if (command === 'backpack') {
    const backpack = await fetchCosmetic(args.join(' '), 'backpack');
    if (backpack) {
      m.client.party.me.setBackpack(backpack.id);
      m.reply(`Set the backpack to ${backpack.name}!`);
    } else m.reply(`The backpack ${args.join(' ')} wasn't found!`);
  } else if (command === 'emoji') {
    const emoji = await fetchCosmetic(args.join(' '), 'emoji');
    if (emoji) {
      m.client.party.me.setEmoji(emoji.id);
      m.reply(`Set the emoji to ${emoji.name}!`);
    } else m.reply(`The emoji ${args.join(' ')} wasn't found!`);
  } else if (command === 'banner') {
    const banner = await fetchCosmetic(args.join(' '), 'banner');
    if (banner) {
      m.client.party.me.setBanner(banner.id);
      m.reply(`Set the emoji to ${banner.name}!`);
    } else m.reply(`The banner ${args.join(' ')} wasn't found!`);
  } else if (command === 'pickaxe') {
    const pickaxe = await fetchCosmetic(args.join(' '), 'pickaxe');
    if (pickaxe) {
      m.client.party.me().setPickaxe(pickaxe.id);
      m.reply(`Set the pickaxe to ${pickaxe.name}!`);
    } else m.reply(`The pickaxe ${args.join(' ')} wasn't found!`);
  } else if (command === 'purpleskull') {
    m.client.party.me.setOutfit('CID_030_Athena_Commando_M_Halloween', [{ channel: 'ClothingColor', variant: 'Mat1' }]);
    m.reply(`Set the skin to Purple Skull Trooper!`);
  } else if (command === 'pinkghoul') {
    m.client.party.me.setOutfit('CID_029_Athena_Commando_F_Halloween', [{ channel: 'Material', variant: 'Mat3' }]);
    m.reply(`Set the skin to Pink Ghoul Trooper!`);
  } else if (command === 'chunlimode') {
    m.client.party.hideMembers(true);
    m.client.party.me.setOutfit('CID_028_Athena_Commando_M_ChunLi', [{ channel: 'Material', variant: 'Mat1' }]);
    m.client.party.me.setEmote('EID_PartyHips');
    m.reply(`Have Fun (;!. If you want to stop then type the Command !default`);
  } else if (command === 'default') {
    m.client.party.hideMembers(false);
    m.client.party.me.setReadiness(false);
    m.party.me.setOutfit(config.cid);
    m.party.me.setBackpack(config.bid);
    m.party.me.setPickaxe(config.pickaxeId);
    m.party.me.setLevel(config.level);
    m.party.me.setBanner(config.banner, config.bannerColor);
    m.reply(`Set the default settings!`);
  } else if (command === 'help') {
    m.reply(`HELP COMMANDS Open the Chat to see all the commands!
        !help - Shows this message
        Cosemtics:
        !skin <skin> - Sets your skin
        !emote <emote> - Sets your emote
        !backpack <backpack> - Sets your backpack
        !emoji <emoji> - Sets your emoji
        !banner <banner> - Sets your banner
        !pickaxe <pickaxe> - Sets your pickaxe
        !purpleskull - Sets your skin to Purple Skull Trooper
        !pinkghoul - Sets your skin to Pink Ghoul Trooper
        !chunlimode - Activates the Mode
        !default - Sets the default settings
        Fun & Util:
        !ready - Sets you to ready
        !unready - Sets you to unready
        !gift - Gifts the whole Lobby the Item Shop
        !hide - Hides Members
        !unhide - Unhides Members
        !level <level> - Sets your level
        !showpickaxe - Shows your pickaxe
        `);
  } else if (command === 'ready') {
    m.client.party.me.setReadiness(true);
    m.reply(`Ready!`);
  } else if (command === 'unready') {
    m.client.party.me.setReadiness(false);
    m.reply(`Unready!`);
  } else if (command === 'gift') {
    m.client.party.me.clearEmote();
    m.client.party.me.setEmote('EID_NeverGonna');
    m.reply(`Uhh, did you really think i was going to gift you?`);
  } else if (command === 'hide') {
    m.client.party.hideMembers(true);
    m.reply(`Hiding Members!`);
  } else if (command === 'unhide') {
    m.client.party.hideMembers(false);
    m.reply(`Unhiding Members!`);
  } else if (command === 'level') {
    m.client.party.me.setLevel(parseInt(content, 10));
    m.reply(`Set your level to ${content}!`);
  } else if (command === 'showpickaxe') {
    m.party.me.setEmote('EID_IceKing');
    m.reply(`Showing Pickaxe!`);
  }
}

async function getAuth(filePath) {
  let auth;
  try {
    auth = { deviceAuth: JSON.parse(await readFile(filePath)) };
  } catch (e) {
    auth = { authorizationCode: async () => Client.consoleQuestion(`Please enter an Auth Code for ${filePath}: `) };
  }
  return auth;
}

function createClient(auth, filePath) {
  const client = new Client({
    "defaultStatus": config.status,
    "platform": config.platform,
    "cachePresences": false,
    "auth": auth,
    "partyConfig": {
      "joinConfirmation": false,
      "joinability": "OPEN",
      "maxSize": 16,
      "chatEnabled": true,
    },
    "debug": false
  });

  client.on('deviceauth:created', (da) => writeFile(filePath, JSON.stringify(da, null, 2)));
  client.on('party:member:message', handleCommand);
  client.on('friend:message', handleCommand);

  client.setLoadout = () => {
    client.party.hideMembers(false);
    client.party.me.setReadiness(false);
    client.party.me.setOutfit(config.cid);
    client.party.me.setBackpack(config.bid);
    client.party.me.setPickaxe(config.pickaxeId);
    client.party.me.setLevel(config.level);
    client.party.me.setBanner(config.banner, config.bannerColor);
    client.party.me.clearEmote();
  };

  client.on("friend:request", (req) => {
    req.accept()
  });

  client.on('party:member:joined', () => {
    m.reply(`Hello, to see my Command use !help`);
    client.setLoadout();
    client.party.setPrivacy(PrivacySetting.PRIVATE);
  });

  client.on('party:member:left', () => {
    client.party.setPrivacy(PrivacySetting.PUBLIC);
    client.setLoadout();
  });

  return client;
}

(async () => {
  const authFiles = [
    './auths/deviceAuth.json',
    './auths/deviceAuth2.json',
    './auths/deviceAuth3.json',
    './auths/deviceAuth4.json',
    './auths/deviceAuth5.json',
    './auths/deviceAuth6.json',
    './auths/deviceAuth7.json',
    './auths/deviceAuth8.json',
    './auths/deviceAuth9.json',
    './auths/deviceAuth10.json',
  ];

  const clients = await Promise.all(authFiles.map(async (filePath) => {
    const auth = await getAuth(filePath);
    const client = createClient(auth, filePath);
    await client.login();
    client.setLoadout();
    console.log(`Logged in as ${client.user.displayName}`);
    return client;
  }));
})();