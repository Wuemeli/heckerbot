const backup = require('../../../backup/src/index.ts');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const backupSchema = require('../../../schemas/backupSchema');

module.exports = {
  structure: new SlashCommandBuilder()
    .setName('backup-list')
    .setDescription('📊 List all Backups of the user'),
  run: async (client, interaction) => {
    try {
      await interaction.deferReply(
        {
          ephemeral: true,
        },
      );

      const userId = interaction.user.id;

      const results = await backupSchema.find({
        userId,
      });

      if (!results.length) {
        return interaction.editReply('You do not have any backups.');
      }

      const backups = [];

      for (const result of results) {
        try {
          await backup.fetch(result.backupId);
          const guild = client.guilds.cache.get(result.guildId);
          const data = `**${result.backupId}** | ${guild.name} (${result.guildId})`;
          backups.push(data);
        } catch {
          await backupSchema.deleteOne({
            backupId: result.backupId,
          });
        }
      }

      const embed = new EmbedBuilder()
        .setTitle('Your Backups')
        .setDescription(backups.join('\n'))
        .setColor('Green');

      interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      interaction.editReply('An error occurred while trying to list the backups.');
    }
  },
};