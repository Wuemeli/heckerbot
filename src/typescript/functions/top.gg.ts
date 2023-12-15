import axios, { AxiosResponse } from 'axios';
import { Client } from 'discord.js';
const { log } = require('../../functions/index');
import { codeError } from './errorHandler';

export default async (client: Client) => {
  if (!process.env.TOPGG_TOKEN) return;

  log('Top.gg Started.', 'done');

  async function postStats() {
    try {
      const response: AxiosResponse = await axios.post(`https://top.gg/api/bots/${client.user?.id}/stats`, {
        server_count: client.guilds.cache.size,
      }, {
        headers: {
          'Authorization': process.env.TOPGG_TOKEN,
        },
      });
      console.log(`Posted stats to top.gg! ${response.status}`);
    } catch (e) {
      codeError(e as Error, 'top.gg.ts');
    }
  }

  client.once('ready', () => {
    postStats();
    setInterval(() => {
      postStats();
    }, 1800000);
  });
};