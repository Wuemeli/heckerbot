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

    const data = await countingschema.findOne({
      guildId: message.guild.id,
    });

    if (!data) return;

    const { channelId, lastNumber, lastUser } = data;
    if (message.channel.id !== channelId) return;

    let content = message.content;

    try {
      content = math.evaluate(content);
    } catch (error) {
      message.delete();
      return;
    }

    if (parseInt(content) === lastNumber) return;
    if (parseInt(content) === lastNumber + 1) {
      await countingschema.findOneAndUpdate({
        guildId: message.guild.id,
      }, {
        channelId,
        lastNumber: content,
        lastUser: message.author.id,
      });

      await message.react('✅');
      return;
    } else {
      await countingschema.findOneAndUpdate({
        guildId: message.guild.id,
      }, {
        channelId,
        lastNumber: 0,
        lastUser: null,
      });

      await message.channel.send({
        content: `**${message.author.username}**, cant count! The counting has been reset.`,
      });
      return;
    }
  },
};