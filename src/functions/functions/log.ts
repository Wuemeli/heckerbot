import { EmbedBuilder } from 'discord.js';
import axios from 'axios';

class logging {
  constructor() {
    if (!process.env.LOG_WEBHOOK_URL) return;
  }

  async log(message: string, error: Error): Promise<void> {
    if (!message) throw new Error('No message provided');

    const embed = new EmbedBuilder()
      .setTitle('🟢 Log')
      .setDescription(message + `\n\`\`\`js\n${error}\n\`\`\``)
      .setColor('Green');

    axios.post(`${process.env.LOG_WEBHOOK_URL}`, { embeds: [embed] });
  }

  async startuplog(message: string, error: Error): Promise<void> {
    if (!message) throw new Error('No message provided');

    const embed = new EmbedBuilder()
      .setTitle('🟢 Startup')
      .setDescription(message + `\n\`\`\`js\n${error}\n\`\`\``)
      .setColor('Green');

    axios.post(`${process.env.LOG_WEBHOOK_URL}`, { embeds: [embed] });
  }

  async anticrashlog(message: string, error: Error): Promise<void> {
    if (!message) throw new Error('No message provided');

    const embed = new EmbedBuilder()
      .setTitle('🟢 AntiCrash')
      .setDescription(message + `\n\`\`\`js\n${error}\n\`\`\``)
      .setColor('Green');

    axios.post(`${process.env.LOG_WEBHOOK_URL}`, { embeds: [embed] });
  }
}

export { logging };