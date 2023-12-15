const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  structure: new SlashCommandBuilder()
    .setName('vote')
    .setDescription('🗳 Gets the Vote Link for the Bot'),
  /**
 * @param {ExtendedClient} client
 * @param {ChatInputCommandInteraction} interaction
 */
  run: async (client, interaction) => {
    await interaction.deferReply();

    try {
      await interaction.editReply(`[Click Here to Vote for ${client.user.username}!](https://top.gg/bot/${client.user.id}/vote)`);
    } catch (error) {
      global.handle.error(client, interaction.guild.id, interaction.user.id, error);
    }
  },
};