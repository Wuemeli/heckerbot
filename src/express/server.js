const express = require('express');
const app = express();
const {log} = require('../functions/index.js');

const port = process.env.PORT || 3000;

module.exports = {
  start: (client) => {

    app.get('/', (req, res) => {
      res.send('slay queen uwu owo rawr');
    });

    app.get('/push', (req, res) => {
      if (req.query.key !== process.env.GIT_KEY) return res.status(401).send('Unauthorized');
      require('child_process').exec('git pull && bun installer && pm2 restart 0', (err, stdout) => {
        if (err) return res.status(500).send(err);
        res.status(200).send(stdout);
      });
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