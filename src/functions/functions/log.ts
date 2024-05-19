import { EmbedBuilder } from 'discord.js';
import axios from 'axios';

class logging {
  constructor() {
    if (!process.env.LOG_WEBHOOK_URL) return;
  }

  async log(message: string): Promise<void> {
    if (!message) throw new Error('No message provided');

    const embed = new EmbedBuilder()
      .setTitle('🟢 Log')
      .setDescription(message)
      .setColor('Green');

    axios.post(`${process.env.LOG_WEBHOOK_URL}`, { embeds: [embed] });
  }

  async startuplog(message: string): Promise<void> {
    if (!message) throw new Error('No message provided');

    const embed = new EmbedBuilder()
      .setTitle('🟢 Startup')
      .setDescription(message)
      .setColor('Green');

    axios.post(`${process.env.LOG_WEBHOOK_URL}`, { embeds: [embed] });
  }

  async custombotlog(message: string): Promise<void> {
    if (!message) throw new Error('No message provided');

    const embed = new EmbedBuilder()
      .setTitle('🟢 CustomBot')
      .setDescription(message)
      .setColor('Green');

    axios.post(`${process.env.LOG_WEBHOOK_URL}`, { embeds: [embed] });
  }

  async anticrashlog(message: string): Promise<void> {
    if (!message) throw new Error('No message provided');

    const embed = new EmbedBuilder()
      .setTitle('🟢 AntiCrash')
      .setDescription(message)
      .setColor('Green');

    axios.post(`${process.env.LOG_WEBHOOK_URL}`, { embeds: [embed] });
  }
}

export { logging };