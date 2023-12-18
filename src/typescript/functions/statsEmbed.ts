import { TextChannel, DMChannel, NewsChannel, Message, Client, EmbedBuilder } from 'discord.js';
import axios from 'axios';
import emojis from '../../functions/emojis';
import os from 'os';

async function fetchCustomBotsCount() {
  const response = await axios.get(`${process.env.CUSTOM_BOT_URL}/health-check`, {
    headers: {
      Authorization: process.env.CUSTOM_BOT_SECRET,
    },
  });

  const serverStats = {
    cpu: `${Math.round((process.cpuUsage().system / 1024 / 1024) * 100) / 100}/${os.cpus().length}`,
    ram: `${Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) / 100}/${Math.round((os.totalmem() / 1024 / 1024) * 100) / 100}`,
    customBotsCount: response.data.customBotsCount,
    customBotCpu: response.data.cpu,
    customBotRam: response.data.ram,
  };

  return serverStats;
}

export default async function editStatsEmbed(client: Client) {
  if (!process.env.STATS_CHANNEL_ID) { return; }
  const { customBotsCount, cpu, ram, customBotCpu, customBotRam } = await fetchCustomBotsCount();

  const embed = new EmbedBuilder()
    .setTitle(`${emojis.online} Bot Statistics`)
    .addFields([
      { name: `${emojis.online} CPU Usage (Current Server)`, value: `${cpu}%`, inline: true },
      { name: `${emojis.online} RAM Usage (Current Server)`, value: `${ram}mb`, inline: true },
      { name: `${emojis.online} CPU Usage (Custom Bot Server)`, value: `${customBotCpu}%`, inline: true },
      { name: `${emojis.online} RAM Usage (Custom Bot Server)`, value: `${customBotRam}mb`, inline: true },
      { name: `${emojis.online} Custom Bots`, value: customBotsCount.toString(), inline: true },
    ])
    .setFooter({ text: `Last updated at ${new Date().toLocaleString()}` });

  const channel = client.channels.cache.get(process.env.STATS_CHANNEL_ID as string);

  if (!channel || !(channel instanceof TextChannel || channel instanceof DMChannel || channel instanceof NewsChannel)) {
    return;
  }

  const messages = await channel.messages.fetch({ limit: 100 });
  const statsMessages = messages.filter((msg: Message) => msg.embeds && msg.embeds[0]?.title === ':online: Bot Statistics');
  const statsMessage = statsMessages.first();

  if (statsMessage) {
    statsMessage.edit({ embeds: [embed] });
  } else {
    channel.send({ embeds: [embed] });
  }
}