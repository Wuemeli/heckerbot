const ExtendedClient = require('../../class/ExtendedClient');
const countingschema = require('../../schemas/countingSchema');
const math = require('mathjs');

module.exports = {
  event: 'messageCreate',
  once: false,
  /**
  *
  * @param {ExtendedClient} client
  * @param {Message<true>} message
  * @returns
  */
  run: async (client, message) => {
    if (message.author.bot) return;

    const { guild, channel, author, content } = message;
    const data = await countingschema.findOne({ guildId: guild.id });

    if (!data || channel.id !== data.channelId) return;

    let evaluatedContent;
    try {
      evaluatedContent = math.evaluate(content);
    } catch (error) {
      await message.delete();
      await message.author.send({ content: 'Your message was deleted because it was not a number.' });
      return;
    }

    const { lastNumber, lastUser, countingMode } = data;

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

    if (parseInt(evaluatedContent) === lastNumber + 1) {

      await countingschema.findOneAndUpdate({ guildId: guild.id }, {
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
      await countingschema.findOneAndUpdate({ guildId: guild.id }, {
        channelId: channel.id,
        lastNumber: 0,
        lastUser: null,
      });

      await channel.send({
        content: `**<@${author.id}>** broke the chain! The counting has been reset to **0**.`,
      });
      return;
    }
  },
};