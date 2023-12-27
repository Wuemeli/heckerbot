const { log } = require('../../functions/functions/consolelog');
const ExtendedClient = require('../../class/ExtendedClient');
const { botInfo } = require('../../functions/custom-bot/main');
const { checkReminders } = require('../../functions/functions/interval');

async function setUserActivity(client, totalUsers, guildcount) {
  const check = await botInfo(client.user.id);
  let status;
  if (check) {
    status = check.status.replace('{users}', totalUsers).replace('{guilds}', guildcount);
  } else {
    status = `${guildcount} servers | ${totalUsers} users | Made with ❤️ by Wuemeli`;
  }
  client.user.setActivity(status, { type: 4 });
  return check;
}

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
    let totalUsers = client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);
    const guildcount = client.guilds.cache.size;

    await setUserActivity(client, totalUsers, guildcount);
    checkReminders(client);
    log(`Logged in as ${client.user.tag}`, 'info');

    setInterval(async () => {
      totalUsers = client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);
      await setUserActivity(client, totalUsers, guildcount);
    }, 60000);
  },
};
