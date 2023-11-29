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
      await interaction.deferReply();

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
        .setColor('Green')
        .addField('Backups', results.map((result, i) => {
          return `**${i + 1}.** \`${result.backupId}\` - \`${guilds[i].name}\``;
        },
        ).join('\n'));

      interaction.editReply({ embeds: [embed], ephemeral: true });
    } catch (error) {
      console.error(error);
    }
  },
};
