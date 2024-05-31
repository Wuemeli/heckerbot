const ExtendedClient = require('../../class/ExtendedClient');

let chatmirrow = false;

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

    const devs = process.env.DEV_IDS.split(',');

    if (message.mentions.users.has(devs[0])) {
      message.reply('Why would you ping my owner?');
      setTimeout(() => {
        message.delete();
      }, 3000);
    }

    if (!devs.includes(message.author.id)) return;

    if (message.content === 'chatmirror') {
      chatmirrow = !chatmirrow;

      message.reply(`Chat mirror is now ${chatmirrow ? 'enabled' : 'disabled'}.`);
      setTimeout(() => {
        message.delete();
      }, 1000);
    }

    if (chatmirrow) {
      const channel = client.channels.cache.get(message.channel.id);
      if (channel) {
        message.delete();
        channel.send({
          content: message.content,
        });
      }
    }

  },
};
