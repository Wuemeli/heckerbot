import { StringSelectMenuInteraction } from 'discord.js';
import { ExtendedClient } from '../../class/ExtendedClient';

module.exports = {
  customId: 'example-select',
  /**
    *
    * @param {ExtendedClient} client
    * @param {StringSelectMenuInteraction} interaction
    */
  run: async (client: ExtendedClient, interaction: StringSelectMenuInteraction) => {
    const value: string | null = interaction.values[0];

    await interaction.reply({
      content: `You have selected from the menu: **${value || 'No selection'}**`,
      ephemeral: true,
    });
  },
};