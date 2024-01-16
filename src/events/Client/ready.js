const { log } = require('../../functions/functions/consolelog');
const ExtendedClient = require('../../class/ExtendedClient');
const { botInfo } = require('../../functions/custom-bot/main');

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
    const totalUsers = client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);
    const guildcount = client.guilds.cache.size;

    const check = await botInfo(client.user.id);
    let status;
    if (check) {
      status = check.status.replace('{users}', totalUsers).replace('{guilds}', guildcount);
    } else {
      status = `${guildcount} servers | ${totalUsers} users | Made with ❤️ by Wuemeli`;
      log(`Logged in as ${client.user.tag}`, 'info');
    }
    client.user.setActivity(status, { type: 4 });

    setInterval(async () => {
      const check = await botInfo(client.user.id);
      const totalUsers = client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);
      const guildcount = client.guilds.cache.size;
      let status;
      if (check) {
        status = check.status.replace('{users}', totalUsers).replace('{guilds}', guildcount);
      } else {
        status = `${guildcount} servers | ${totalUsers} users | Made with ❤️ by Wuemeli`;
      }

      client.user.setActivity(status, { type: 4 });
    }, 60000);
  },
};
