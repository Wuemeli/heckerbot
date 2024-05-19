import { Client } from '../../class/ExtendedClient';
import { Message } from 'discord.js';

export default {
  event: 'messageCreate',
  once: false,
  /**
   *
   * @param {Client} client
   * @param {Message} message
   * @returns
   */
  run: async (client: Client, message: Message) => {
    if (message.author.bot) return;
    const devs = process.env.DEV_IDS?.split(',') || [];

    if (message.mentions.users.some((user) => devs.includes(user.id))) {
      message.reply('Why would you ping my owner?');
    }

    // Admin commands here if needed in the future
  },
};