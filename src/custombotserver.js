const express = require('express');
const { startallBots, createBot } = require('./typescript/custom-bot/main');
const { log } = require('./functions/index');
const custombotSchema = require('./schemas/custombotSchema');
const mongoose = require('./handlers/mongoose');

const app = express();
app.use(express.json());

const port = process.env.CUSTOM_BOT_PORT || 3001;
const secret = process.env.CUSTOM_BOT_SECRET;

mongoose();

startallBots();
log('Custom bot server started', 'done');

app.post('/create', async (req, res) => {
  try {
    const { userId, token, clientId, status } = req.body;
    await createBot(token, clientId);
    await custombotSchema.create({ userId, token, clientId, status });
    res.send('Custom bot created');
  } catch (error) {
    console.log(error);
    res.status(500).send('Error during createBot');
  }
});

app.listen(port, () => {
  log(`Custom bot server listening at http://localhost:${port}`, 'done');
});