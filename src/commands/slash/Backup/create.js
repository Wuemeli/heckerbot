const backup = require('../../../backup/src/index.ts');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const backupSchema = require('../../../schemas/backupSchema');
const emojis = require('../../../functions/emojis');

module.exports = {
  structure: new SlashCommandBuilder()
    .setName('backup-create')
    .setDescription('📊 Create a backup of the server'),
  /**
 * @param {ExtendedClient} client
 * @param {ChatInputCommandInteraction} interaction
 */
  run: async (client, interaction) => {
    try {
      await interaction.deferReply(
        {
          ephemeral: true,
        },
      );


      if (!interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)) {
        return interaction.editReply({ content: `${emojis.erroricon} You need the \`Manage Server\` permission to use this command!`, ephemeral: true });
      }

      backup.create(interaction.guild, {
      }).then((backupData) => {
        const embed = new EmbedBuilder()
          .setTitle('Backup Created')
          .setDescription('**Backup ID:** ' + backupData.id + '\n**We strongly recommend to dont share this ID with anyone!**')
          .setColor('Green');

        interaction.editReply({ embeds: [embed] });
        const backup = new backupSchema({
          userId: interaction.user.id,
          backupId: backupData.id,
          guildId: interaction.guild.id,
        });
        backup.save();
      },
      );
    } catch (error) {
      global.handle.error(client, interaction.guild.id, interaction.user.id, error);
    }
  },
};
