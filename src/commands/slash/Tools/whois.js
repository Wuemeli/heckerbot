const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');
const { getData, setData } = require('../../../typescript/redis/index');

module.exports = {
  structure: new SlashCommandBuilder()
    .setName('whois')
    .setDescription('Gets the WHOIS information for a domain name.')
    .addStringOption((opt) =>
      opt.setName('domain')
        .setDescription('🔎・The domain name to look up.')
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
      let whoisData = await getData(`whois:${domain}`);

      if (whoisData) {
        whoisData = JSON.parse(whoisData);

        const whoisembedcached = new EmbedBuilder()
          .setTitle(`🔍 WHOIS information for **${domain}**`)
          .setColor('Green')
          .setFooter({ text: 'This data has been cached.' })
          .addFields(
            {
              name: 'Registrar:',
              value: `\`\`\`${whoisData.registrar}\`\`\``,
              inline: true,
            },
            {
              name: 'WHOIS Server:',
              value: `\`\`\`${whoisData.whois_server}\`\`\``,
              inline: true,
            },
            {
              name: 'Updated Date:',
              value: `\`\`\`${new Date(whoisData.updated_date).toLocaleString()}\`\`\``,
              inline: true,
            },
            {
              name: 'Creation Date:',
              value: `\`\`\`${new Date(whoisData.creation_date).toLocaleString()}\`\`\``,
              inline: true,
            },
            {
              name: 'Expiration Date:',
              value: `\`\`\`${new Date(whoisData.expiration_date).toLocaleString()}\`\`\``,
              inline: true,
            },
            {
              name: 'DNSSEC:',
              value: `\`\`\`${whoisData.dnssec}\`\`\``,
              inline: true,
            },
          );
        interaction.editReply({
          embeds: [whoisembedcached],
        });
      } else {
        const response = await axios.get(`https://api.api-ninjas.com/v1/whois?domain=${domain}`, {
          headers: {
            'X-Api-Key': process.env.API_NINJAS_KEY,
          },
        });

        const data = response.data;

        await setData(`whois:${domain}`, JSON.stringify(response.data));

        const whoisembed = new EmbedBuilder()
          .setTitle(`🔍 WHOIS information for **${domain}**`)
          .setColor('Green')
          .addFields(
            {
              name: 'Registrar:',
              value: `\`\`\`${data.registrar}\`\`\``,
              inline: true,
            },
            {
              name: 'WHOIS Server:',
              value: `\`\`\`${data.whois_server}\`\`\``,
              inline: true,
            },
            {
              name: 'Updated Date:',
              value: `\`\`\`${new Date(data.updated_date * 1000).toLocaleString()}\`\`\``,
              inline: true,
            },
            {
              name: 'Creation Date:',
              value: `\`\`\`${new Date(data.creation_date * 1000).toLocaleString()}\`\`\``,
              inline: true,
            },
            {
              name: 'Expiration Date:',
              value: `\`\`\`${new Date(data.expiration_date * 1000).toLocaleString()}\`\`\``,
              inline: true,
            },
            {
              name: 'DNSSEC:',
              value: `\`\`\`${data.dnssec}\`\`\``,
              inline: true,
            },
          );
        interaction.editReply({
          embeds: [whoisembed],
        });
      }
    } catch (error) {
      global.handle.error(client, interaction.guild.id, interaction.user.id, error);
    }
  },
};
