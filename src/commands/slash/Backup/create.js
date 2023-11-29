const backup = require('../../../backup/src/index.ts');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const backupSchema = require('../../../schemas/backupSchema');
const emojis = require('../../../functions/emojis');

module.exports = {
  structure: new SlashCommandBuilder()
    .setName('backup-create')
    .setDescription('📊 Create a backup of the server'),
  run: async (client, interaction) => {
    try {
      await interaction.deferReply();


      if (!interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)) {
        return interaction.reply({ content: `${emojis.erroricon} You need the \`Manage Server\` permission to use this command!`, ephemeral: true });
      }

      backup.create(interaction.guild, {
      }).then((backupData) => {
        const embed = new EmbedBuilder()
          .setTitle('Backup Created')
          .setDescription('**Backup ID:** ' + backupData.id + '\n**We strongly recommend to dont share this ID with anyone!**')
          .setColor('Green');

        interaction.editReply({ embeds: [embed], ephemeral: true });
        const backup = new backupSchema({
          userId: interaction.user.id,
          backupId: backupData.id,
          guildId: interaction.guild.id,
        });
        backup.save();
      },
      );
    } catch (error) {
      console.error(error);
    }
  },
};
