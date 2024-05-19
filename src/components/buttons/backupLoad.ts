import { ButtonInteraction } from 'discord.js';
import ExtendedClient from '../../class/ExtendedClient';
import { loadBackup } from '../../functions/backup/index';
import { checkIcon, errorIcon } from '../../functions/functions/emojis';

module.exports = {
  customId: 'confirm-load-backup',
  /**
   * @param {ExtendedClient} client
   * @param {ButtonInteraction} interaction
   */
  run: async (client: ExtendedClient, interaction: ButtonInteraction) => {
    try {
      const backupId = interaction.message.content.split(': ')[1];

      await loadBackup(backupId, interaction.guild).then(() => {
        interaction.user.send({ content: `${checkIcon} Backup loaded successfully` });
      }).catch((err) => {
        interaction.user.send({ content: `${errorIcon} An error occurred while loading the backup` });
      });
    } catch (error) {
      global.handle.error(client, interaction.guild.id, interaction.user.id, error, interaction);
    }
  },
};