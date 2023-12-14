const {log} = require('../../functions');
const ExtendedClient = require('../../class/ExtendedClient');

module.exports = {
  event: 'ready',
  once: true,
  /**
     *
     * @param {ExtendedClient} _
     * @param {import('discord.js').Client<true>} client
     * @returns
     */
  run: (_, client) => {
    const usercount = client.users.cache.size;
    const guildcount = client.guilds.cache.size;
    
    client.user.setActivity(`${guildcount} servers | ${usercount} users | Made with ❤️ by Wuemeli`, {type: 4});

    log('Logged in as: ' + client.user.tag, 'done');
  },
};
