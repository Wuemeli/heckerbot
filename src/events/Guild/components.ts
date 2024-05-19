import { ExtendedClient } from '../../class/ExtendedClient';
import { Interaction } from 'discord.js';

import { log } from '../../functions/functions/consolelog';
import { emojis } from '../../functions/functions/emojis';

export default {
  event: 'interactionCreate',
  /**
   * @param {ExtendedClient} client
   * @param {Interaction} interaction
   * @returns
   */
  run: async (client: ExtendedClient, interaction: Interaction) => {
    if (interaction.isButton()) {
      const component = client.collection.components.buttons.get(interaction.customId);

      if (!component) return;

      try {
        await component.run(client, interaction);
      } catch (error) {
        log(error, 'error');
      }

      return;
    }

    if (interaction.isAnySelectMenu()) {
      const component = client.collection.components.selects.get(interaction.customId);

      if (!component) return;

      try {
        await component.run(client, interaction);
      } catch (error) {
        log(error, 'error');
      }

      return;
    }

    if (interaction.isModalSubmit()) {
      const component = client.collection.components.modals.get(interaction.customId);

      if (!component) return;

      try {
        await component.run(client, interaction);
      } catch (error) {
        log(error, 'error');
      }

      return;
    }
  },
};