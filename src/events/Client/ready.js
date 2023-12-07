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
  run: async (_, client) => {

    let totalUsers = 0;
    client.guilds.cache.forEach(guild => {
      totalUsers += guild.memberCount;
    });

    const guildcount = client.guilds.cache.size;

    client.user.setActivity(`${guildcount} servers | ${totalUsers} users | Made with ❤️ by Wuemeli`, { type: 4 });

    setInterval(async () => {
      
      let totalUsers = 0;
      client.guilds.cache.forEach(guild => {
        totalUsers += guild.memberCount;
      });

      const guildcount = client.guilds.cache.size;
      client.user.setActivity(`${guildcount} servers | ${totalUsers} users | Made with ❤️ by Wuemeli`, { type: 4 });
    }, 600000);

    log('Logged in as: ' + client.user.tag, 'done');
  },
};