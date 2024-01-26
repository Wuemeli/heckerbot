const ExtendedClient = require('../../class/ExtendedClient');
const { predictToxicity } = require('../../functions/functions/aimod');
const aimodschema = require('../../schemas/aimodSchema');

module.exports = {
  event: 'messageCreate',
  once: false,
  /**
   * @param {ExtendedClient} client
   * @param {Message<true>} message
   * @returns
   */
  run: async (client, message) => {
    const data = await aimodschema.findOne({ guildId: message.guild.id });
    if (!data) return;
    if (data.toggle === false) return;
    
    if (message.author.bot) return;
    if (!message.guild) return;
    if (message.author.id === client.user.id) return;
    await predictToxicity(message.content, client, message);
  },
};


