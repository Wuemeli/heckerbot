import { ExtendedClient } from '../../class/ExtendedClient';
import { botInfo } from '../../functions/custom-bot/main';

export default {
  event: 'ready',
  once: true,
  /**
   *
   * @param {ExtendedClient} _
   * @param {Client} client
   * @returns
   */
  run: async (_, client: ExtendedClient): Promise<void> => {
    const totalUsers = client.guilds.cache.reduce((a, g) => a + g.memberCount, 0);
    const guildcount = client.guilds.cache.size;
    const check = await botInfo(client.user.id);

    let status: string;
    if (check) {
      status = check.status.replace('{users}', totalUsers.toString()).replace('{guilds}', guildcount.toString());
    } else {
      status = `${guildcount} servers | ${totalUsers} users | Made with ❤️ by Wuemeli`;
      console.log(`Logged in as ${client.user.tag}`, 'info');
    }
    client.user.setActivity(status, { type: 4 });

    setInterval(async () => {
      const check = await botInfo(client.user.id);
      const totalUsers = client.guilds.cache.reduce((a, g) => a + g.memberCount, 0);
      const guildcount = client.guilds.cache.size;
      let status: string;

      if (check) {
        status = check.status.replace('{users}', totalUsers.toString()).replace('{guilds}', guildcount.toString());
      } else {
        status = `${guildcount} servers | ${totalUsers} users | Made with ❤️ by Wuemeli`;
      }

      client.user.setActivity(status, { type: 4 });
    }, 60000);
  },
};