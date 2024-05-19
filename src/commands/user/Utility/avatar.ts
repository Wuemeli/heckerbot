import { UserContextMenuCommandInteraction, ContextMenuCommandBuilder, EmbedBuilder } from 'discord.js';
import ExtendedClient from '../../../class/ExtendedClient';

module.exports = {
  structure: new ContextMenuCommandBuilder()
    .setName('Avatar')
    .setType(2),
  options: {
    nsfw: false,
    category: 'Utility',
    premium: false,
    cooldown: 1,
  },
  /**
   * @param {ExtendedClient} client
   * @param {UserContextMenuCommandInteraction} interaction
   */
  run: async (client: ExtendedClient, interaction: UserContextMenuCommandInteraction) => {
    await interaction.deferReply();

    const user = interaction.options.getUser('user') || interaction.user;

    const avatarURL = user.displayAvatarURL({ dynamic: true, size: 4096 });
    try {
      const embed = new EmbedBuilder()
        .setTitle(`${user.username}'s Avatar`)
        .setImage(avatarURL)
        .setColor('Blurple');

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      global.handle.error(client, interaction.guild.id, interaction.user.id, error, interaction);
    }
  },
};