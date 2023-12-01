const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  structure: new SlashCommandBuilder()
    .setName('faq')
    .setDescription('❗(Maybe) Answers some Questions'),
  run: async (client, interaction) => {
    await interaction.deferReply();

    try {

      const embed = new EmbedBuilder()
        .setName('FAQ')
        .setColor('Green')
        .addFields(
          {
            name: 'How long are Backups Stored?',
            value: 'Backups are stored for 6 Months. After this Timeframe passed we will automatically delete the Backups',
            inline: false,
          },
          {
            name: 'Where are Backups Stored?',
            value: 'Backups are stored at Cloudflare R2 its cheap and fast way to store Data in so called Buckets',
            inline: false,
          },
          {
            name: 'Why is the Backuping Service free?',
            value: 'Beacuse Cloudflare R2 is so cheap and a normal Backuping File Size is about 500KB. In Cloudflare R2 you pay per GB 0.25 Bucks.',
            inline: false,
          });

      interaction.editReply({ embeds: [embed] });

    } catch (error) {
      global.handle.error(client, interaction.guild.id, interaction.user.id, error);
    }
  },
};