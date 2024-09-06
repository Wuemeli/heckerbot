import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import axios from 'axios';

export default {
  structure: new SlashCommandBuilder()
    .setName('changelog')
    .setDescription('🟰・Displays the last 10 Commits of the bot.'),
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
      const { data: commits } = await axios.get('https://api.github.com/repos/Wuemeli/heckerbot/commits');

      const description = commits
        .slice(0, 10)
        .map((commit: any) => {
          const author = commit.commit.author;
          const commitMessage = commit.commit.message;
          return `[${author.name}](https://github.com/${author.name}) - ${commitMessage}`;
        })
        .join('\n');

      const embed = new EmbedBuilder()
        .setTitle('Changelog')
        .setDescription(description)
        .setColor('Green');

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      global.handle.error(client, interaction.guild?.id || 'Unknown Guild', interaction.user.id, error, interaction);
    }
  },
};
