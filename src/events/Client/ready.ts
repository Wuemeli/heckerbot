import { ExtendedClient } from '../../class/ExtendedClient';

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
    //MAKE THIS BETTER
    const totalUsers = client.guilds.cache.reduce((a, g) => a + g.memberCount, 0);
    const guildcount = client.guilds.cache.size;
    const status = `${guildcount} servers | ${totalUsers} users | Made with ❤️ by Wuemeli`;

    console.log(`Logged in as ${client.user.tag}`);
    client.user.setActivity(status, { type: 4 });

    setInterval(async () => {
      const totalUsers = client.guilds.cache.reduce((a, g) => a + g.memberCount, 0);
      const guildcount = client.guilds.cache.size;
      const status = `${guildcount} servers | ${totalUsers} users | Made with ❤️ by Wuemeli`;


      client.user.setActivity(status, { type: 4 });
    }, 60000);
  },
};