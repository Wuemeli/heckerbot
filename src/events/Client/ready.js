const { log } = require('../../functions/functions/consolelog');
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
    //Fix this soon
    const totalUsers = client.guilds.cache.reduce((a, g) => a + g.memberCount, 0);
    const guildcount = client.guilds.cache.size;
    const status = `${ guildcount } servers | ${ totalUsers } users | Made with ❤️ by Wuemeli`;

    client.user.setActivity(status, { type: 4 });

    setInterval(async () => {
      const totalUsers = client.guilds.cache.reduce((a, g) => a + g.memberCount, 0);
      const guildcount = client.guilds.cache.size;
      const status = `${guildcount} servers | ${totalUsers} users | Made with ❤️ by Wuemeli`;
      client.user.setActivity(status, { type: 4 });
    }, 60000);
  },
};
