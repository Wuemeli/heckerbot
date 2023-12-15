const ExtendedClient = require('../../class/ExtendedClient');
const axios = require('axios');

module.exports = {
  event: 'messageCreate',
  once: false,
  /**
   * @param {ExtendedClient} client
   * @param {Message<true>} message
   * @returns
   */
  run: async (client, message) => {
    if (message.mentions.has(client.user.id)) {
      if (!message.content.startsWith(`<@${client.user.id}>`)) return;
      const response = await axios.get('https://randomuselessfact.appspot.com/random.json?language=en');
      const fact = response.data.text;

      await message.reply({
        content: `**${message.author.username}**, here's a random fact for you: ${fact}`,
      });
    }
  },
};