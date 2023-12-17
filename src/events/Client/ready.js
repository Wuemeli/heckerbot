const {log} = require('../../functions');
const ExtendedClient = require('../../class/ExtendedClient');
const { clientIdInfo } = require('../../typescript/custom-bot/main');

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

    const check = await clientIdInfo(client.user.id);
    if (check) {
      check.status = check.status.replace('{users}', totalUsers);
      check.status = check.status.replace('{guilds}', guildcount);
      client.user.setActivity(check.status, { type: 4 });
    } else {
      client.user.setActivity(`${guildcount} servers | ${totalUsers} users | Made with ❤️ by Wuemeli`, { type: 4 });
      log('Logged in as: ' + client.user.tag, 'done');

    }

    setInterval(async () => {
      let totalUsers = 0;
      client.guilds.cache.forEach(guild => {
        totalUsers += guild.memberCount;
      });
      const guildcount = client.guilds.cache.size;

      const check = await clientIdInfo(client.user.id);
      if (check) {
        client.user.setActivity(check.status, { type: 4 });
      } else {
        client.user.setActivity(`${guildcount} servers | ${totalUsers} users | Made with ❤️ by Wuemeli`, { type: 4 });
      }
    }, 60000);
  },
};
