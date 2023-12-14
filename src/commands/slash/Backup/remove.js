const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const backupSchema = require('../../../schemas/backupSchema');
const backup = require('../../../backup/src/index.ts');

module.exports = {
  structure: new SlashCommandBuilder()
    .setName('backup-remove')
    .setDescription('🗑️ Remove a backup')
    .addStringOption(option =>
      option.setName('backup-id')
        .setDescription('The ID of the backup to remove')
        .setRequired(true)),
  run: async (client, interaction) => {
    try {
      await interaction.deferReply({ ephemeral: true });

      const backupId = interaction.options.getString('backup-id');
      const userId = interaction.user.id;

      const backupData = await backupSchema.findOne({ backupId, userId });
      if (!backupData) {
        return interaction.editReply('You do not have a backup with that ID or you did not create it.');
      }

      await backup.remove(backupId);
      await backupSchema.deleteOne({ backupId });

      interaction.editReply('Backup removed successfully.');
    } catch (error) {
      console.error(error);
      interaction.editReply('An error occurred while trying to remove the backup.');
    }
  },
};