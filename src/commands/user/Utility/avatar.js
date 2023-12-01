const { UserContextMenuCommandInteraction, ContextMenuCommandBuilder, EmbedBuilder } = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');

module.exports = {
  structure: new ContextMenuCommandBuilder()
    .setName('Avatar')
    .setType(2),
  /**
   * @param {ExtendedClient} client
   * @param {UserContextMenuCommandInteraction} interaction
   */
  run: async (client, interaction) => {
    await interaction.deferReply();

    const user = interaction.options.getUser('user') || interaction.user;

    const avatarURL = user.displayAvatarURL({ dynamic: true, size: 4096 });
    try {
      const embed = new EmbedBuilder()
        .setTitle(`${user.username}'s Avatar`)
        .setImage(avatarURL)
        .setColor('Green');

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      global.handle.error(client, interaction.guild.id, interaction.user.id, error);
    }
  },
};