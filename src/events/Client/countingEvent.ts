import { Client, Message } from 'discord.js';
import CountingSchema from '../../schemas/countingSchema';
import * as math from 'mathjs';

interface Data {
  lastNumber: number;
  lastUser: string | null;
  countingMode: string[];
}

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

    const { guild, channel, author, content } = message;
    const data = await CountingSchema.findOne({ guildId: guild.id });

    if (!data || channel.id !== data.channelId) return;

    let evaluatedContent: number;
    try {
      evaluatedContent = math.evaluate(content);
    } catch (error) {
      await message.delete();
      await message.author.send({ content: 'Your message was deleted because it was not a number.' });
      return;
    }

    const { lastNumber, lastUser, countingMode }: Data = data;

    if (countingMode.includes('singleCount') && lastUser === author.id) {
      await message.author.send({ content: 'You cannot count twice in a row!' });
      await message.delete();
      return;
    }

    if (countingMode.includes('nofail') && evaluatedContent !== lastNumber + 1) {
      await message.author.send({ content: 'You cannot count twice in a row!' });
      await message.delete();
      return;
    }

    if (evaluatedContent === lastNumber + 1) {

      await CountingSchema.findOneAndUpdate({ guildId: guild.id }, {
        channelId: channel.id,
        lastNumber: evaluatedContent,
        lastUser: author.id,
      });

      await message.delete();

      let webhooks = await channel.fetchWebhooks();
      let webhook = webhooks.find((wh) => wh.name === 'Counting Webhook');

      if (!webhook) {
        webhook = await channel.createWebhook({ name: 'Counting Webhook' });
      }

      try {
        await webhook.send({
          content: String(evaluatedContent),
          username: author.username,
          avatarURL: author.displayAvatarURL({ dynamic: true }),
        });

      } catch (error) {
        console.error(`Failed to send webhook: ${error}`);
      }

      return;
    } else {
      await CountingSchema.findOneAndUpdate({ guildId: guild.id }, {
        channelId: channel.id,
        lastNumber: 0,
        lastUser: null,
      });

      await channel.send({
        content: `**<@${author.id}>** broke the chain The counting has been reset to **0**.`,
      });
      return;
    }
  },
};