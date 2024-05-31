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
