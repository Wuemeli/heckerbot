const express = require('express');
const app = express();
const { log } = require('../functions/functions/consolelog');
const bodyParser = require('body-parser');
const cors = require('cors');
const emojis = require('../functions/functions/emojis');
const axios = require('axios');
const port = process.env.PORT || 3000;

axios.defaults.headers.common['Accept-Encoding'] = 'gzip';

async function getBotVotes(client) {
  try {
    const response = await axios.get(`https://top.gg/api/bots/${process.env.CLIENT_ID}/votes`, {
      headers: { 'Authorization': process.env.TOPGG_TOKEN },
    });

    return response.data.length;
  } catch (error) {
    console.error('Failed to fetch votes from Top.gg:', error);
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
      const totalUsers = client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);
      const guildCount = client.guilds.cache.size;

      const topggvotes = await getBotVotes(client);

      res.json({ users: totalUsers, guilds: guildCount, votes: topggvotes });
    });

    app.listen(port, () => {
      log(`Web Server is Listening on port ${port}`, 'info');
    });
  },
};