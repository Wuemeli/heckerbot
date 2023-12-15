import { AxiosResponse } from 'axios';
import axios from 'axios';
import { codeError } from '../functions/errorHandler.js';
const FORTNITE_API = 'https://fortnite-api.com/v2/cosmetics/br/search?name=';

interface Message {
  content: string;
  reply: (content: string) => void;
  client: {
    party: {
      me: {
        setOutfit: (id: string) => void;
        setEmote: (id: string) => void;
        setBackpack: (id: string) => void;
        setPickaxe: (id: string) => void;
        setReadiness: (ready: boolean) => void;
        hideMembers: (hide: boolean) => void;
        setLevel: (level: number) => void;
      };
    };
  };
}

type CommandAction = (m: Message, args?: string[]) => void | Promise<void>;

const commandActions: Record<string, CommandAction> = {
  'skin': async (m: Message, args: string[]) => {
    const skinName = args.join(' ');
    const response: AxiosResponse = await axios.get(`${FORTNITE_API}${skinName}`);
    m.client.party.me.setOutfit(response.data.data.id);
  },
  'emote': async (m: Message, args: string[]) => {
    const emoteName = args.join(' ');
    const response: AxiosResponse = await axios.get(`${FORTNITE_API}${emoteName}`);
    m.client.party.me.setEmote(response.data.data.id);
  },
  'backpack': async (m: any, args: string[]): Promise<void> => {
    const backpackName = args.join(' ');
    const response = await axios.get(`${FORTNITE_API}${backpackName}`);
    m.client.party.me.setBackpack(response.data.data.id);
  },
  'pickaxe': async (m: any, args: string[]): Promise<void> => {
    const pickaxeName = args.join(' ');
    const response = await axios.get(`${FORTNITE_API}${pickaxeName}`);
    m.client.party.me.setPickaxe(response.data.data.id);
  },
  'ready': (m: any): void => {
    m.client.party.me.setReadiness(true);
    m.reply('Ready!');
  },
  'unready': (m: any): void => {
    m.client.party.me.setReadiness(false);
    m.reply('Unready!');
  },
  'gift': (m: any): void => {
    m.reply('Uhh, did you really think i was going to gift you?');
    m.client.party.me.setEmote('EID_NeverGonna');
  },
  'hide': (m: any): void => {
    m.client.party.hideMembers(true);
    m.reply('Hiding Members!');
  },
  'unhide': (m: any): void => {
    m.client.party.hideMembers(false);
    m.reply('Unhiding Members!');
  },
  'level': (m: any, args: string[]): void => {
    m.client.party.me.setLevel(parseInt(args[0], 10));
    m.reply(`Set my Level to ${args[0]}!`);
  },
  'default': (m: any): void => {
    m.client.party.me.setOutfit('CID_001_Athena_Commando_F_Default');
    m.client.party.me.setBackpack('BID_001_BlackKnight');
    m.client.party.me.setPickaxe('Pickaxe_Lockjaw');
    m.client.party.me.setLevel(100);
    m.reply('Default Loadout!');
  },
};

const handleCommand = async (m: any): Promise<void> => {
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
    codeError(err as Error, 'src/fn-bot/main.js');
  }
};

export {
  handleCommand,
};
