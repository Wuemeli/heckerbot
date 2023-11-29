const ExtendedClient = require('../../class/ExtendedClient');
const countingschema = require('../../schemas/countingSchema');

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
    if (isNaN(message.content)) return;
    // if (message.content === '0') return;
    if (parseInt(message.content) === lastNumber) return;
    if (parseInt(message.content) === lastNumber + 1) {
      await countingschema.findOneAndUpdate({
        guildId: message.guild.id,
      }, {
        channelId,
        lastNumber: message.content,
        lastUser: message.author.id,
      });
      return message.react('✅');
    } else {
      await countingschema.findOneAndUpdate({
        guildId: message.guild.id,
      }, {
        channelId,
        lastNumber: 0,
        lastUser: null,
      });
      return message.channel.send(`You broke the chain! ${message.author} has reset the counting to 0!`);
    }
  },
};