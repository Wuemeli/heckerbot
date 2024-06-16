import { ButtonInteraction } from 'discord.js';
import ExtendedClient from '../../class/ExtendedClient';
import load from '../../functions/backup/index';
import emojis from '../../functions/functions/emojis';

export default {
  customId: 'confirm-load-backup',
  /**
   * @param {ExtendedClient} client
   * @param {ButtonInteraction} interaction
   */
  run: async (client: ExtendedClient, interaction: ButtonInteraction) => {
    try {
      const backupId = interaction.message.content.split(': ')[1];

      await load(backupId, interaction.guild).then(() => {
        interaction.user.send({ content: `${emojis.checkicon} Backup loaded successfully` });
      }).catch((err) => {
        interaction.user.send({ content: `${emojis.errorIcon} An error occurred while loading the backup` });
      });
    } catch (error) {
      global.handle.error(client, interaction.guild.id, interaction.user.id, error, interaction);
    }
  },
};x