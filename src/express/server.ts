import express, { Request, Response } from 'express';
import { Client } from 'discord.js'; 
import { log } from '../functions/functions/consolelog';
import bodyParser from 'body-parser';
import cors from 'cors';
import emojis from '../functions/functions/emojis';
import axios from 'axios';

const port = process.env.PORT || 3000;

interface VoteData {
  points: number;
}

async function getBotVotes(): Promise<VoteData> {
  try {
    const response = await axios.get(`https://top.gg/api/bots/${process.env.CLIENT_ID}`, {
      headers: { 'Authorization': process.env.TOPGG_TOKEN },
    });

    return response.data;
  } catch (error) {
    console.error(error);
    return { points: 0 };
  }
}

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req: Request, res: Response) => {
  res.send('slay queen uwu owo rawr xD');
});

app.post('/topgg', (req: Request, res: Response) => {
  if (!process.env.TOPGG_SECRET) return res.status(500).send('Internal Server Error');
  const auth = req.headers.authorization;
  const providedAuth = process.env.TOPGG_SECRET;

  if (auth === providedAuth) {
    const { user } = req.body;
    client.users.fetch(user)
      .then(user1 => {
        const channel = client.channels.cache.get(process.env.TOPGG_CHANNEL);
        channel.send(`**${user1}** just voted for me on [top.gg](https://top.gg/bot/${client.user.id}/vote)! Thank you so much ${emojis.pepeheart}`);
        res.status(200).send('Webhook received');
      })
      .catch(console.error);
  } else {
    res.status(401).send('Unauthorized');
  }
});

app.get('/stats', async (req: Request, res: Response) => {
  const totalUsers = client.guilds.cache.reduce((a: number, g: any) => a + g.memberCount, 0);
  const guildCount = client.guilds.cache.size;

  const topGuilds = Array.from(client.guilds.cache.values())
    .sort((a: any, b: any) => b.memberCount - a.memberCount)
    .slice(0, 30);

  const topggvotes = await getBotVotes();

  res.json({
    users: totalUsers,
    guilds: guildCount,
    votes: topggvotes.points,
    topGuilds: topGuilds.map(guild => ({
      name: guild.name,
      memberCount: guild.memberCount,
      avatar: guild.iconURL(),
    })),
  });
});

export const start = async (client: Client) => {
  app.listen(port, () => {
    log(`Web Server is Listening on port ${port}`, 'info');
  });
};