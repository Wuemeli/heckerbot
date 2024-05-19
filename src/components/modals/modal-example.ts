import { ModalSubmitInteraction } from 'discord.js';
import { ExtendedClient } from '../../class/ExtendedClient';

/**
 * Represents a modal example component.
 */
export default {
  customId: 'modal-example',
  /**
    *
    * @param {ExtendedClient} client
    * @param {ModalSubmitInteraction} interaction
    */
  run: async (client: ExtendedClient, interaction: ModalSubmitInteraction) => {
    const nameInput = interaction.fields.getTextInputValue('name');

    await interaction.reply({
      content: `Hey **${nameInput}**, what's up?`,
    });
  },
};