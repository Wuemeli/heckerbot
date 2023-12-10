const Discord = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const axios = require('axios');

const webhookid = process.env.ERROR_WEBHOOK_ID;
const webhooktoken = process.env.ERROR_WEBHOOK_TOKEN;

class handling {
  constructor(client = {}) {
    this.client = client;
    this.webhook = new Discord.WebhookClient({ id: webhookid, token: webhooktoken });
  }
  /**
  * @param {object} [client] - Discord client, will save the data in a Map to prevent multiple fetches
  * @param {string} [guildId] - Discord guild id
  * @param {string} [userId] - Discord user
  * @param {string} [errors] - the error
  */
  async error(client, guildId, userId, errors) {
    if (!client) throw new Error('No client provided');
    if (!guildId) throw new Error('No guildId provided');
    if (!errors) throw new Error('No errors provided');
    if (!userId) throw new Error('No userId provided');

    const guild = await client.guilds.fetch(guildId);
    const user = await client.users.fetch(userId);
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


async function codeError(error, filename) {
  const errorid = Math.floor(Math.random() * 1000000000000000000);
  const embed = new EmbedBuilder()
    .setTitle('🔴 Error')
    .setDescription(`**Error:** ${error.stack} \n **Error ID:** ${errorid} \n **File:** ${filename}`)
    .setColor('Red');

  axios.post(`${process.env.ERROR_WEBHOOK_URL}`, { embeds: [embed] });
}

module.exports = { handling, codeError };