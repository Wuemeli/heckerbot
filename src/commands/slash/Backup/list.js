const backup = require('../../../backup/src/index.ts');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const backupSchema = require('../../../schemas/backupSchema');
const emojis = require('../../../functions/emojis');

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

      const guilds = [];

      for (const result of results) {
        try {
          const guild = await client.guilds.fetch(result.guildId);
          guilds.push(guild);
        } catch (error) {
          guilds.push({ name: 'Get the name with /backup-info' });
        }
      }

      const embed = new EmbedBuilder()
        .setTitle('Backups')
        .setDescription('Here are all your Backups')
        .setColor('Green');

      for (const guild of guilds) {
        embed.addFields({
          name: guild.name,
          value: `ID: \`${backup.fetch(userId, guild.id).id}\``,
          inline: true,
        });
      }

      interaction.editReply({ embeds: [embed] });
    } catch (error) {
      global.handle.error(client, interaction.guild.id, interaction.user.id, error);
    }
  },
};
