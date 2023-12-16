const express = require('express');
const { startallBots, createBot, stopBot } = require('./typescript/custom-bot/main');
const { log } = require('./functions/index');
const custombotSchema = require('./schemas/custombotSchema');
const mongoose = require('./handlers/mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());


const port = process.env.CUSTOM_BOT_PORT || 3001;
const secret = process.env.CUSTOM_BOT_SECRET;

mongoose();

startallBots();
log('Custom bot server started', 'done');

app.get('/health-check', (req, res) => {
  res.send('ok');
});

app.post('/create', async (req, res) => {
  try {
    if (req.headers.authorization !== secret) return res.status(401).send('Unauthorized');
    const { userId, token, clientId, status } = req.body;
    const check = await custombotSchema.findOne({ userId });
    if (check) return res.status(409).send('Bot already exists');
    await createBot(token, clientId);
    await custombotSchema.create({ userId, token, clientId, status });
    res.status(201).send('Custom bot created');
  } catch (error) {
    console.log(error);
    res.status(500).send('Error during createBot');
  }
});

app.post('/stop', async (req, res) => {
  try {
    console.log('Received stop request');
    if (req.headers.authorization !== secret) return res.status(401).send('Unauthorized');
    const { clientId } = req.body;
    const data = await custombotSchema.findOne({ clientId });
    if (!data) return res.status(404).send('Bot not found');
    console.log('Calling stopBot function');
    await stopBot(clientId);
    console.log('stopBot function called');
    res.status(200).send('Custom bot stopped');
  } catch (error) {
    console.log(error);
    res.status(500).send('Error during stopBot');
  }
});

app.post('/delete', async (req, res) => {
  try {
    if (req.headers.authorization !== secret) return res.status(401).send('Unauthorized');
    const { userId } = req.body;
    const data = await custombotSchema.findOne({ userId });
    if (!data) return res.status(404).send('Bot not found');
    await data.delete();
    res.status(200).send('Custom bot deleted');
  } catch (error) {
    console.log(error);
    res.status(500).send('Error during deleteBot');
  }
});

app.listen(port, () => {
  log(`Custom bot server listening at http://localhost:${port}`, 'done');
});