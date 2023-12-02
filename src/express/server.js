const express = require('express');
const app = express();
const { log } = require('../functions/index.js');
const bodyParser = require('body-parser');
const cors = require('cors');
const execFile = require('child_process').execFile;
const emojis = require('../functions/emojis');

const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.use(cors());

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
        const user1 = client.users.cache.get(user);
        const channel = client.channels.cache.get(process.env.TOPGG_CHANNEL);
        channel.send(`**${user1}** just voted for me on top.gg! Thank you so much! ${emojis.pepeheart}`);
        res.status(200).send('Webhook received');
      } else {
        res.status(401).send('Unauthorized');
      }
    });

    app.post('/push', async (req, res) => {
      const { body } = req;
      const secretkey = req.query.key;

      if (body && body.ref === 'refs/heads/main' && secretkey === process.env.GIT_KEY) {
        try {
          await execFile('git', ['pull']);
          await execFile('bun', ['installer']);
          await execFile('pm2', ['restart', 'all']);

          console.log('Commands executed successfully');
          res.status(200).send('Webhook received and commands executed');
        } catch (error) {
          console.error('Error executing commands:', error.message);
          res.status(500).send('Internal Server Error');
        }
      } else {
        console.log('Webhook received but conditions not met');
        res.status(200).send('Webhook received, but conditions not met');
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

    app.listen(port, () => {
      log(`Web Server is Listening on port ${port}`, 'info');
    });
  },
};