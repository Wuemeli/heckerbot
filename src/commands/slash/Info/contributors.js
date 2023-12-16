const { SlashCommandBuilder, EmbedBuilder, WebhookClient } = require('discord.js');
const axios = require('axios');

module.exports = {
  structure: new SlashCommandBuilder()
    .setName('contributors')
    .setDescription('🫅・Displays the contributors of the bot.'),
  options: {
    nsfw: false,
    category: 'Info',
    cooldown: 1,
  },
  /**
 * @param {ExtendedClient} client
 * @param {ChatInputCommandInteraction} interaction
 */
  run: async (client, interaction) => {
    await interaction.deferReply();

    try {
      const { data } = await axios.get(
        'https://api.github.com/repos/Wuemeli/heckerbot/contributors',
      );

      const contributors = data
        .map((contributor) => {
          return `[${contributor.login}](${contributor.html_url})`;
        })
        .join(', ');

      const embed = new EmbedBuilder()
        .setTitle('Contributors')
        .setDescription(contributors)
        .setFooter({ text: 'Thanks for contributing! ❤️' });

      await interaction.editReply({ embeds: [embed] });

    } catch (error) {
      global.handle.error(client, interaction.guild.id, interaction.user.id, error);
    }
  },
};