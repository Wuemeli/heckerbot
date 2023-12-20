import { Guild, User, EmbedBuilder } from 'discord.js';
import axios from 'axios';

class handling {
  client: any;

  constructor(client = {}) {
    this.client = client;
  }

  async error(client: any, guildId: string, userId: string, errors: Error): Promise<void> {
    if (!client) throw new Error('No client provided');
    if (!guildId) throw new Error('No guildId provided');
    if (!errors) throw new Error('No errors provided');
    if (!userId) throw new Error('No userId provided');

    const guild: Guild = await client.guilds.fetch(guildId);
    const user: User = await client.users.fetch(userId);
    const errorid = Math.floor(Math.random() * 1000000000000000000);

    const embed = new EmbedBuilder()
      .setTitle('🔴 Error')
      .setDescription(`**Guild:** ${guild.name} \n **User:** ${user.tag} \n **Error:** ${errors.stack} \n **Error ID:** ${errorid}`)
      .setColor('Red');

    axios.post(`${process.env.ERROR_WEBHOOK_URL}`, { embeds: [embed] });

    const userembed = new EmbedBuilder()
      .setTitle('🔴 Error')
      .setDescription(`Hey there, it seems like an error occured in ${guild.name}. \n We already notified the developers about this, please try again later. \n **Error ID:** ${errorid}`)
      .setColor('Red');

    user.send({ embeds: [userembed] });
  }
}

async function codeError(error: Error, filename: string): Promise<void> {
  const errorid = Math.floor(Math.random() * 1000000000000000000);
  const embed = new EmbedBuilder()
    .setTitle('🔴 Error')
    .setDescription(`**Error:** ${error.stack} \n **Error ID:** ${errorid} \n **File:** ${filename}`)
    .setColor('Red');

  axios.post(`${process.env.ERROR_WEBHOOK_URL}`, { embeds: [embed] });
}

export { handling, codeError };