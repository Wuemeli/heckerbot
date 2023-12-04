const backup = require('../../../backup/src/index.ts');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const backupSchema = require('../../../schemas/backupSchema');
const emojis = require('../../../functions/emojis');

module.exports = {
  structure: new SlashCommandBuilder()
    .setName('backup-load')
    .setDescription('📊 Loads the Backup of the server')
    .addStringOption(option => option
      .setName('backup-id')
      .setDescription('The ID of the backup')
      .setRequired(true)),
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

    if (!interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)) {
      return interaction.editReply({ content: `${emojis.erroricon} You need the \`Manage Server\` permission to use this command!`, ephemeral: true });
    }

    const backupId = interaction.options.getString('backup-id');

    try {

      backup.load(backupId, interaction.guild);

    } catch (error) {
      global.handle.error(client, interaction.guild.id, interaction.user.id, error);
    }
  },
};