const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const ms = require('ms');

module.exports = {
  structure: new SlashCommandBuilder()
    .setName('botstats')
    .setDescription('📊・Displays the bot statistics.'),
  options: {
    nsfw: false,
    category: 'Info',
    cooldown: 1,
  },
  /**
   * @param {import('discord.js').Client} client
   * @param {import('discord.js').CommandInteraction} interaction
   */
  run: async (client, interaction) => {
    await interaction.deferReply();

    try {
      const totalGuilds = String(client.guilds.cache.size);
      const cachedUsers = String(client.users.cache.size);
      const totalUsers = String(client.guilds.cache.reduce((a, g) => a + g.memberCount, 0));
      const humans = String(client.guilds.cache.reduce((a, g) => a + g.memberCount, 0));

      const date = new Date().getTime() - client.uptime;

      const statsEmbed = new EmbedBuilder()
        .setTitle('📊 Bot Statistics')
        .setColor('Green');

      statsEmbed.addFields(
        { name: '👥 Total Guilds', value: totalGuilds, inline: true },
        { name: '🧑 Total Users', value: totalUsers, inline: true },
        { name: '👤 Humans', value: humans, inline: true },
        { name: '📥 Cached Users', value: cachedUsers, inline: true },
        { name: '⌛ Latency', value: `${ms(client.ws.ping)}`, inline: true },
        {
          name: '🕒 Uptime',
          value: `Started on: <t:${Math.floor(new Date(date).getTime() / 1000)}> (<t:${Math.floor(new Date(date).getTime() / 1000)}:R>)`,
          inline: true,
        },
      );

      await interaction.editReply({ embeds: [statsEmbed] });
    } catch (error) {
      global.handle.error(client, interaction.guild?.id, interaction.user.id, error, interaction);
    }
  },
};