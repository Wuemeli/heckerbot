const express = require('express');
const { startallBots, createBot, bots, stopBot, startBot } = require('./functions/custom-bot/main');
const { log } = require('./functions/functions/consolelog');
const custombotSchema = require('./schemas/custombotSchema');
const mongoose = require('./handlers/mongoose');
const { logging } = require('./functions/functions/log');
const cors = require('cors');
const { codeError, handling } = require('./functions/functions/errorHandler');
const { Client, Partials } = require('discord.js');
const os = require('os');
const app = express();
const { loadModel } = require('./functions/functions/aimod');

app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
  const secret = process.env.CUSTOM_BOT_SECRET;
  if (req.headers.authorization !== secret) return res.status(401).send('Unauthorized');
  next();
});

const port = process.env.CUSTOM_BOT_PORT || 3001;

loadModel();
mongoose();
global.handle = new handling();
global.log = new logging();

global.log.startuplog('Started custom bot server');

startallBots();
log('Custom bot server started', 'done');

app.get('/health-check', (req, res) => {
  res.send({
    status: 'ok',
    ram: `${Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) / 100}/${Math.round((os.totalmem() / 1024 / 1024) * 100) / 100}`,
    cpu: `${Math.round((process.cpuUsage().system / 1024 / 1024) * 100) / 100}/${os.cpus().length}`,
    customBotsCount: Object.keys(bots).length,
  });
});

app.post('/create', async (req, res) => {
  try {
    const { userId, token, clientId, status } = req.body;

    const check = await custombotSchema.findOne({ userId });
    if (check) return res.status(404).send('Bot already exists');

    const isValid = await validateTokenAndClientId(token, clientId, res);
    if (!isValid) return;

    await createBot(token, clientId);
    await custombotSchema.create({ userId, token, clientId, status });
    res.status(200).send('Custom bot created');
  } catch (error) {
    codeError(error, 'src/custombotserver.js');
    res.status(500).send('Error during createBot');
  }
});

app.post('/edit', async (req, res) => {
  try {
    const { userId, token, clientId, status } = req.body;
    const data = await custombotSchema.findOne({ userId });

    if (!data) return res.status(404).send('Bot not found');

    const isValid = await validateTokenAndClientId(token, clientId, res);
    if (!isValid) return;

    await custombotSchema.findOneAndUpdate({ userId }, { token, clientId, status });

    await stopBot(userId);

    if (!bots[userId]) {
      bots[userId] = {};
    }

    if (!bots[userId].token) {
      bots[userId].token = token;
    }

    if (!bots[userId].status) {
      bots[userId].status = status;
    }

    bots[userId].token = token;
    bots[userId].status = status;

    await startBot(userId);

    res.status(200).send('Custom bot edited');
  } catch (error) {
    codeError(error, 'src/custombotserver.js');
    res.status(500).send('Error during editBot');
  }
});

app.post('/delete', async (req, res) => {
  try {
    const { userId } = req.body;
    const data = await custombotSchema.findOne({ userId });

    if (!data) return res.status(404).send('Bot not found');

    await custombotSchema.findOneAndDelete({ userId });

    res.status(200).send('Custom bot deleted');
  } catch (error) {
    codeError(error, 'src/custombotserver.js');
    res.status(500).send('Error during deleteBot');
  }
});

async function validateTokenAndClientId(token, clientId, res) {
  try {
    const client = new Client({
      intents: Object.values({
        intents: 3276543,
      }),
      partials: [Object.keys(Partials)],
    });

    try {
      await Promise.race([
        client.login(token),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Login timed out')), 5000)),
      ]);
      if (client.user.id !== clientId) {
        setTimeout(() => client.destroy(), 5000);
        res.status(401).send('Unauthorized');
        return false;
      } else {
        setTimeout(() => client.destroy(), 5000);
        return true;
      }
    } catch (error) {
      res.status(401).send('Unauthorized');
      return false;
    }
  }
  catch (error) {
    res.status(401).send('Unauthorized');
    return false;
  }
}

app.listen(port, () => {
  log(`Custom bot server listening at http://localhost:${port}`, 'done');
});

process.on('unhandledRejection', (reason) => global.log.anticrashlog('unhandledRejection', reason));
process.on('uncaughtException', (reason) => global.log.anticrashlog('uncaughtException', reason));
process.on('uncaughtExceptionMonitor', (reason) => global.log.anticrashlog('uncaughtExceptionMonitor', reason));
process.on('warning', (reason) => global.log.anticrashlog('warning', reason));