const express = require('express');
const app = express();
const {log} = require('../functions/index.js');
const bodyParser = require('body-parser');

const port = process.env.PORT || 3000;

app.use(bodyParser.json());

module.exports = {
  start: (client) => {

    app.get('/', (req, res) => {
      res.send('slay queen uwu owo rawr xD');
    });

    app.post('/push', async (req, res) => {
      const { body } = req;
      const secretkey = req.query.key;

      if (body && body.ref === 'refs/heads/main' && secretkey === process.env.GIT_KEY) {
        try {
          await require('child_process').exec('git pull');
          await require('child_process').exec('bun installer');
          await require('child_process').exec('pm2 restart all');

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