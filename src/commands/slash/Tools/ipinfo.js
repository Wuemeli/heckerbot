const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');
const { getData, setData } = require('../../../typescript/redis/index');

module.exports = {
  structure: new SlashCommandBuilder()
    .setName('ipinfo')
    .setDescription('🌐・Gets the information of an IP address.')
    .addStringOption((opt) =>
      opt.setName('ip')
        .setDescription('What is the IP address?')
        .setRequired(true),
    ),
  options: {
    nsfw: false,
    category: 'Tools',
    cooldown: 1,
  },
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
      let ipData = await getData(`ipinfo:${ip}`);

      if (ipData) {
        ipData = JSON.parse(ipData);

        const ipembedcached = new EmbedBuilder()
          .setTitle(`🔍 Here is some information for you on **${ip}**!`)
          .setColor('Green')
          .setFooter({ text: 'This data has been cached.' })
          .addFields(
            {
              name: 'Type of IP:',
              value: `\`\`\`${ipData.type}\`\`\``,
              inline: true,
            },
            {
              name: 'Continent:',
              value: `\`\`\`${ipData.continent}\`\`\``,
              inline: true,
            },
            {
              name: 'Country:',
              value: `\`\`\`${ipData.country}\`\`\``,
              inline: true,
            },
            {
              name: 'State:',
              value: `\`\`\`${ipData.region}\`\`\``,
              inline: true,
            },
            {
              name: 'City:',
              value: `\`\`\`${ipData.city}\`\`\``,
              inline: true,
            },
            {
              name: 'Timezone:',
              value: `\`\`\`${ipData.timezone_name}\`\`\``,
              inline: true,
            },
            {
              name: 'ISP:',
              value: `\`\`\`${ipData.isp}\`\`\``,
              inline: true,
            },
            {
              name: 'Flag:',
              value: `:flag_${ipData.country_code}:`.toLocaleLowerCase(),
              inline: true,
            },
          );
        await interaction.editReply({
          embeds: [ipembedcached],
        });
      } else {

        const { data } = await axios.get(`https://ipwhois.app/json/${ip}`);

        const country = data.country_code;

        await setData(`ipinfo:${ip}`, JSON.stringify(data));

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
      }
    } catch (error) {
      global.handle.error(client, interaction.guild.id, interaction.user.id, error);
    }
  },
};
