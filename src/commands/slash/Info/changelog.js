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

      const embed = new EmbedBuilder()
        .setTitle('Changelog')
        .setDescription('Here are the last 10 Commits of the bot')
        .setColor('Green');

      for (let i = 0; i < 10; i++) {
        const commit = commits.data[i];
        const author = commit.author;
        const commitMessage = commit.commit.message;
        embed.addFields({ name: `${author.name}`, value: `${commitMessage}` });      }

      interaction.editReply({ embeds: [embed] });

    } catch (error) {
      global.handle.error(client, interaction.guild.id, interaction.user.id, error);
    }
  },
};