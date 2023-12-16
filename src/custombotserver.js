require('dotenv').config();
const config = require('./config.js');
if (config.dotenv.enabled) {
  require('dotenv').config({ DOTENV_KEY: 'ENVKEY' });
}

const express = require('express');
const { startallBots, createBot } = require('./typescript/custom-bot/main');
const { log } = require('./functions/index');
const custombotSchema = require('./schemas/custombotSchema');


const app = express();
const port = process.env.CUSTOM_BOT_PORT || 3001;

startallBots();
log('Custom bot server started', 'done');

app.get('/start', async (req, res) => {
  try {
    await startallBots();
    res.send('All custom bots started');
  } catch (error) {
    log('Error during startallBots', 'error');
    res.status(500).send('Error during startallBots');
  }
});

app.post('/create', async (req, res) => {
  try {
    const { userId, token, clientId, status } = req.body;
    await createBot(token, clientId);
    await custombotSchema.create({ userId, token, clientId, status });
    res.send('Custom bot created');
  } catch (error) {
    log('Error during createBot', 'error');
    res.status(500).send('Error during createBot');
  }
});

app.listen(port, () => {
  log(`Custom bot server listening at http://localhost:${port}`, 'done');
});