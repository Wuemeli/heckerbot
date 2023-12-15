const express = require('express');
const app = express();
const { log } = require('../functions/index.js');
const bodyParser = require('body-parser');
const cors = require('cors');
const emojis = require('../functions/emojis');

const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.use(cors());

log('Server Started.', 'done');


module.exports = {
  start: (client) => {

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

    app.get('/stats', (req, res) => {
      const userCount = client.users.cache.size;
      const guildCount = client.guilds.cache.size;
      const channelCount = client.channels.cache.size;

      res.json({
        userCount,
        guildCount,
        channelCount,
      });
    });

    app.get('/health-check', (req, res) => {
      res.json({
        'OK': true,
      });
    });

    app.listen(port, () => {
      log(`Web Server is Listening on port ${port}`, 'info');
    });
  },
};