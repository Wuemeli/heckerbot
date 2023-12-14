const { SlashCommandBuilder, EmbedBuilder, WebhookClient } = require('discord.js');
const axios = require('axios');

module.exports = {
  structure: new SlashCommandBuilder()
    .setName('changelog')
    .setDescription('🟰 Displays the last 10 Commits of the bot.'),
  run: async (client, interaction) => {
    await interaction.deferReply();

    try {
      const commits = await axios.get('https://api.github.com/repos/Wuemeli/heckerbot/commits');

      const description = commits.data
        .map((commit) => {
          const author = commit.commit.author;
          const commitMessage = commit.commit.message;
          return `[${author.name}](https://github.com/${author.name}) - ${commitMessage}`;
        })
        .join('\n');

      const embed = new EmbedBuilder()
        .setTitle('Changelog')
        .setDescription(description)
        .setColor('Green');

      interaction.editReply({ embeds: [embed] });

    } catch (error) {
      global.handle.error(client, interaction.guild.id, interaction.user.id, error);
    }
  },
};