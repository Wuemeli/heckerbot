const { MessageFlags } = require('discord.js');
const ExtendedClient = require('../../class/ExtendedClient');

let chatmirror = false;

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
    const devs = process.env.DEV_IDS.split(',');
    if (message.author.bot || !devs.includes(message.author.id)) return;

    if (message.content === 'chatmirror') {
      message.delete();
      chatmirror = !chatmirror;
      return;
    }

    if (chatmirror) {
      const channel = client.channels.cache.get(message.channel.id);
      if (channel) {
        message.delete();
        channel.send({
          content: message.content,
        }).then((msg) => {
          setTimeout(() => {
            msg.delete();
          }, 30000);
        });
      }
    }

  },
};
