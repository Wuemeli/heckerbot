const express = require('express');
const app = express();
const {log} = require('../functions/index.js');

const port = process.env.PORT || 3000;

module.exports = {
  start: (client) => {

    app.get('/', (req, res) => {
      res.send('slay queen uwu owo rawr');
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