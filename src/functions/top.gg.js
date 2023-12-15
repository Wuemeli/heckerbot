const axios = require('axios');
const { log } = require('../functions/index');

module.exports = async (client) => {
  if (!process.env.TOPGG_TOKEN) return;

  log('Top.gg Started.', 'done');


  async function postStats() {
    try {
      const response = await axios.post(`https://top.gg/api/bots/${client.user.id}/stats`, {
        server_count: client.guilds.cache.size,
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