const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  structure: new SlashCommandBuilder()
    .setName('support')
    .setDescription('🕹️ Get the Invite Link to the Discord Support Server'),
  run: async (client, interaction) => {
    await interaction.deferReply();

    try {
      await interaction.editReply(`[Click here to join the Support Server!](${process.env.SUPP_INVITE_URL})`);
    } catch (error) {
      global.handle.error(client, interaction.guild.id, interaction.user.id, error);
    }
  },
};