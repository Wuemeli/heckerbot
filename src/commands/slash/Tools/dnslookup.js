const {SlashCommandBuilder, EmbedBuilder} = require('discord.js');
const axios = require('axios');

module.exports = {
  structure: new SlashCommandBuilder()
    .setName('dnslookup')
    .setDescription('🔍 Performs a DNS lookup on a domain name.')
    .addStringOption((opt) =>
      opt.setName('domain')
        .setDescription('The domain name to perform a DNS lookup on.')
        .setRequired(true),
    ),
  /**
     * @param {ExtendedClient} client
     * @param {ChatInputCommandInteraction} interaction
     */
  run: async (client, interaction) => {

    await interaction.deferReply();

    const domain = interaction.options.getString('domain');

    try {
      const response = await axios.get(`https://api.api-ninjas.com/v1/dnslookup?domain=${domain}`, {
        headers: {
          'X-Api-Key': process.env.API_NINJAS_KEY,
        },
      });

      const data = response.data;

      const dnslookupembed = new EmbedBuilder()
        .setTitle(`🔍 DNS lookup for **${domain}**`)
        .setColor('Green')
        .addFields(
          {
            name: 'A records:',
            value: data.filter((record) => record.record_type === 'A').map((record) => `\`\`\`${record.value}\`\`\``).join('\n') || 'No A records found',
            inline: true,
          },
          {
            name: 'AAAA records:',
            value: data.filter((record) => record.record_type === 'AAAA').map((record) => `\`\`\`${record.value}\`\`\``).join('\n') || 'No AAAA records found',
            inline: true,
          },
          {
            name: 'MX records:',
            value: data.filter((record) => record.record_type === 'MX').map((record) => `\`\`\`${record.value}\`\`\``).join('\n') || 'No MX records found',
            inline: true,
          },
          {
            name: 'NS records:',
            value: data.filter((record) => record.record_type === 'NS').map((record) => `\`\`\`${record.value}\`\`\``).join('\n') || 'No NS records found',
            inline: true,
          },
          {
            name: 'SOA record:',
            value: data.filter((record) => record.record_type === 'SOA').map((record) => `**MName:** ${record.mname}\n**RName:** ${record.rname}\n**Serial:** ${record.serial}\n**Refresh:** ${record.refresh}\n**Retry:** ${record.retry}\n**Expire:** ${record.expire}\n**TTL:** ${record.ttl}`).join('\n') || 'No SOA record found',
            inline: true,
          },
          {
            name: 'TXT records:',
            value: data.filter((record) => record.record_type === 'TXT').map((record) => `\`\`\`${record.value}\`\`\``).join('\n') || 'No TXT records found',
            inline: true,
          },
        );

      await interaction.editReply({
        embeds: [dnslookupembed],
      });
    } catch (error) {
      global.handle.error(client, interaction.guild.id, interaction.user.id, error);
    }
  },
};
