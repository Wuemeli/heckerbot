const ExtendedClient = require('../../class/ExtendedClient');

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

    if (message.mentions.users.some((user) => devs.includes(user.id))) {
      message.reply('Why would you ping my owner?');
    }

    //Admin commands here if i need some in the future
  },
};
