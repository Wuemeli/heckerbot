const {SlashCommandBuilder, EmbedBuilder} = require('discord.js');
const axios = require('axios');

module.exports = {
  structure: new SlashCommandBuilder()
    .setName('ipinfo')
    .setDescription('🌐 Gets the information of an IP address.')
    .addStringOption((opt) =>
      opt.setName('ip')
        .setDescription('What is the IP address?')
        .setRequired(true),
    ),
  /**
     * @param {ExtendedClient} client
     * @param {ChatInputCommandInteraction} interaction
     */
  run: async (client, interaction) => {

    await interaction.deferReply(
      {
        ephemeral: true,
      },
    );

    const ip = interaction.options.getString('ip');

    try {
      const {data} = await axios.get(`https://ipwhois.app/json/${ip}`);

      const country = data.country_code;

      const ipembed = new EmbedBuilder()
        .setTitle(`🔍 Here is some information for you on **${ip}**!`)
        .setColor('Green')
        .addFields(
          {
            name: 'Type of IP:',
            value: `\`\`\`${data.type}\`\`\``,
            inline: true,
          },
          {
            name: 'Continent:',
            value: `\`\`\`${data.continent}\`\`\``,
            inline: true,
          },
          {
            name: 'Country:',
            value: `\`\`\`${data.country}\`\`\``,
            inline: true,
          },
          {
            name: 'State:',
            value: `\`\`\`${data.region}\`\`\``,
            inline: true,
          },
          {
            name: 'City:',
            value: `\`\`\`${data.city}\`\`\``,
            inline: true,
          },
          {
            name: 'Timezone:',
            value: `\`\`\`${data.timezone_name}\`\`\``,
            inline: true,
          },
          {
            name: 'ISP:',
            value: `\`\`\`${data.isp}\`\`\``,
            inline: true,
          },
          {
            name: 'Flag:',
            value: `:flag_${country}:`.toLocaleLowerCase(),
            inline: true,
          },
        );
      await interaction.editReply({
        embeds: [ipembed],
      });
    } catch (error) {
      global.handle.error(client, interaction.guild.id, interaction.user.id, error);
    }
  },
};
