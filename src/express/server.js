const express = require('express');
const app = express();
const { log } = require('../functions/functions/consolelog');
const bodyParser = require('body-parser');
const cors = require('cors');
const emojis = require('../functions/functions/emojis');
const axios = require('axios');
const port = process.env.PORT || 3000;
const { usercount } = require('../functions/functions/misc');

axios.defaults.headers.common['Accept-Encoding'] = 'gzip';

async function getBotVotes() {
  try {
    const response = await axios.get(`https://top.gg/api/bots/${process.env.CLIENT_ID}`, {
      headers: { 'Authorization': process.env.TOPGG_TOKEN },
    });

    return response.data.points;
  } catch (error) {
    return 0;
  }
}

app.use(bodyParser.json());
app.use(cors());

log('Server Started.', 'done');

module.exports = {
  start: async (client) => {
    app.get('/', (req, res) => {
      res.send('slay queen uwu owo rawr xD');
    });

    app.post('/topgg', (req, res) => {
      if (!process.env.TOPGG_SECRET) return res.status(500).send('Internal Server Error');
      const auth = req.headers.authorization;
      const providedAuth = process.env.TOPGG_SECRET;

      if (auth === providedAuth) {
        const { user } = req.body;
        client.users.fetch(user)
          .then(user1 => {
            const channel = client.channels.cache.get(process.env.TOPGG_CHANNEL);
            channel.send(`**${user1}** just voted for me on [top.gg](https://top.gg/bot/${client.user.id}/vote)! Thank you so much! ${emojis.pepeheart}`);
            res.status(200).send('Webhook received');
          })
          .catch(console.error);
      } else {
        res.status(401).send('Unauthorized');
      }
    });

    app.get('/stats', async (req, res) => {
      const totalUsers = await usercount(client);
      const guildCount = client.guilds.cache.size;

      const topGuilds = Array.from(client.guilds.cache.values())
        .sort((a, b) => b.memberCount - a.memberCount)
        .slice(0, 30);

      const topggvotes = await getBotVotes();

      res.json({
        users: totalUsers,
        guilds: guildCount,
        votes: topggvotes,
        topGuilds: topGuilds.map(guild => ({
          name: guild.name,
          memberCount: guild.memberCount,
          avatar: guild.iconURL(),
        })),
      });
    });
    app.listen(port, () => {
      log(`Web Server is Listening on port ${port}`, 'info');
    });
  },
};