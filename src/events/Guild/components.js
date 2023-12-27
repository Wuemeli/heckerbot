const { log } = require('../../functions/functions/consolelog');
const { permissionChecker } = require('../../functions/functions/permissionChecker');
const emojis = require('../../functions/functions/emojis');

module.exports = {
  event: 'interactionCreate',
  /**
     *
     * @param {ExtendedClient} client
     * @param {import('discord.js').Interaction} interaction
     * @returns
     */
  run: (client, interaction) => {

    if (!permissionChecker(interaction)) {
      return interaction.reply({
        content: `${emojis.erroricon} I don't have the required permissions to run this command. Please reinvite me with the correct permissions.`,
        ephemeral: true,
      });
    }

    if (interaction.isButton()) {
      const component = client.collection.components.buttons.get(interaction.customId);

      if (!component) return;

      try {
        component.run(client, interaction);
      } catch (error) {
        log(error, 'error');
      }

      return;
    }

    if (interaction.isAnySelectMenu()) {
      const component = client.collection.components.selects.get(interaction.customId);

      if (!component) return;

      try {
        component.run(client, interaction);
      } catch (error) {
        log(error, 'error');
      }

      return;
    }

    if (interaction.isModalSubmit()) {
      const component = client.collection.components.modals.get(interaction.customId);

      if (!component) return;

      try {
        component.run(client, interaction);
      } catch (error) {
        log(error, 'error');
      }

      return;
    }
  },
};
