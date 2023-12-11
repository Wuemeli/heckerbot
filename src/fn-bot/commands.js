const { codeError } = require('../functions/errorHandler');
const axios = require('axios');

const FORTNITE_API = 'https://fortnite-api.com/v2/cosmetics/br/search?name=';

const commandActions = {
  'skin': async (m, args) => {
    const skinName = args.join(' ');
    const response = await axios.get(`${FORTNITE_API}${skinName}`);
    m.client.party.me.setOutfit(response.data.data.id);
  },
  'emote': async (m, args) => {
    const emoteName = args.join(' ');
    const response = await axios.get(`${FORTNITE_API}${emoteName}`);
    m.client.party.me.setEmote(response.data.data.id);
  },
  'backpack': async (m, args) => {
    const backpackName = args.join(' ');
    const response = await axios.get(`${FORTNITE_API}${backpackName}`);
    m.client.party.me.setBackpack(response.data.data.id);
  },
  'pickaxe': async (m, args) => {
    const pickaxeName = args.join(' ');
    const response = await axios.get(`${FORTNITE_API}${pickaxeName}`);
    m.client.party.me.setPickaxe(response.data.data.id);
  },
  'ready': (m) => {
    m.client.party.me.setReadiness(true);
    m.reply('Ready!');
  },
  'unready': (m) => {
    m.client.party.me.setReadiness(false);
    m.reply('Unready!');
  },
  'gift': (m) => {
    m.reply('Uhh, did you really think i was going to gift you?');
    m.client.party.me.setEmote('EID_NeverGonna');
  },
  'hide': (m) => {
    m.client.party.hideMembers(true);
    m.reply('Hiding Members!');
  },
  'unhide': (m) => {
    m.client.party.hideMembers(false);
    m.reply('Unhiding Members!');
  },
  'level': (m, args) => {
    m.client.party.me.setLevel(parseInt(args[0], 10));
    m.reply(`Set my Level to ${args[0]}!`);
  },
  'default': (m) => {
    m.client.party.me.setOutfit('CID_001_Athena_Commando_F_Default');
    m.client.party.me.setBackpack('BID_001_BlackKnight');
    m.client.party.me.setPickaxe('Pickaxe_Lockjaw');
    m.client.party.me.setLevel(100);
    m.reply('Default Loadout!');
  },
};

const handleCommand = async (m) => {
  try {
    if (!m || !m.content || !m.content.startsWith('!')) return;
    const args = m.content.slice(1).split(' ');
    const command = args.shift().toLowerCase();
    const action = commandActions[command];
    if (action) {
      await action(m, args);
    }
  }
  catch (err) {
    codeError(err, 'src/fn-bot/main.js');
  }
};

module.exports = {
  handleCommand,
};