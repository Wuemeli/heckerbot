import { TextChannel, DMChannel, NewsChannel, Message, Client, EmbedBuilder } from 'discord.js';
import axios from 'axios';
const emojis = require('..//functions/emojis.js');
import os from 'os';

async function fetchCustomBotsCount() {
  let response;
  try {
    response = await axios.get(`${process.env.CUSTOM_BOT_URL}/health-check`, {
      headers: {
        Authorization: process.env.CUSTOM_BOT_SECRET,
      },
    });
  } catch (error) {
    console.log('Error fetching custom bot stats');
  }

  const serverStats = {
    cpu: `${Math.round((process.cpuUsage().system / 1024 / 1024) * 100) / 100}/${os.cpus().length}`,
    ram: `${Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) / 100}/${Math.round((os.totalmem() / 1024 / 1024) * 100) / 100}`,
    customBotsCount: response ? response.data.customBotsCount : '0',
    customBotCpu: response ? response.data.cpu : '0',
    customBotRam: response ? response.data.ram : '0'
  };

  return serverStats;
}

export default async function editStatsEmbed(client: Client) {
  if (!process.env.STATS_CHANNEL_ID) { return; }
  const { customBotsCount, cpu, ram, customBotCpu, customBotRam } = await fetchCustomBotsCount();

  const embed = new EmbedBuilder()
    .setTitle(`${emojis.online} Bot Statistics`)
    .setDescription(`I live on a server with CPU usage: ${cpu}%, RAM usage: ${ram} MB. \nMy friend, the Custom Bot Server, has CPU usage: ${customBotCpu}%, RAM usage: ${customBotRam} mb, and hosts ${customBotsCount} custom bots.`)
    .setFooter({ text: `Last updated at ${new Date().toLocaleString()}` });

  const channel = client.channels.cache.get(process.env.STATS_CHANNEL_ID as string);

  if (!channel || !(channel instanceof TextChannel || channel instanceof DMChannel || channel instanceof NewsChannel)) {
    return;
  }

  const messages = await channel.messages.fetch({ limit: 100 });
  const statsMessages = messages.filter((msg: Message) => msg.embeds && msg.embeds[0]?.title.includes('Bot Statistics'))
  const statsMessage = statsMessages.first();

  if (statsMessage) {
    statsMessage.edit({ embeds: [embed] });
  } else {
    channel.send({ embeds: [embed] });
  }
}