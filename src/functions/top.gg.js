const axios = require('axios');

module.exports = async (client) => {
  if (!process.env.TOPGG_TOKEN) return;

  async function postStats() {
    try {

      let totalUsers = 0;
      client.guilds.cache.forEach(guild => {
        totalUsers += guild.memberCount;
      });

      const response = await axios.post(`https://top.gg/api/bots/${client.user.id}/stats`, {
        server_count: totalUsers,
      }, {
        headers: {
          'Authorization': process.env.TOPGG_TOKEN,
        },
      });
      console.log(`Posted stats to top.gg! ${response.status}`);
    } catch (e) {
      console.log(`Oops! ${e}`);
    }
  }

  client.once('ready', () => {
    postStats();
    setInterval(() => {
      postStats();
    }, 1800000);
  });
};