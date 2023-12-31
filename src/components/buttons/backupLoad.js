const { ButtonInteraction } = require('discord.js');
const ExtendedClient = require('../../class/ExtendedClient');
const backupSchema = require('../../schemas/backupSchema');
const backup = require('../../functions/backup/index.ts');
const EmbedBuilder = require('discord.js');
const emojis = require('../../functions/functions/emojis');

module.exports = {
  customId: 'confirm-load-backup',
  /**
   * @param {ExtendedClient} client
   * @param {ButtonInteraction} interaction
   */
  run: async (client, interaction) => {
    try {
      const backupId = interaction.message.content.split(': ')[1];
      console.log(backupId);

      backup.load(backupId, interaction.guild).then(() => {
        interaction.user.send({ content: `${emojis.successicon} Backup loaded successfully!` });
      }).catch((err) => {
        interaction.user.send({ content: `${emojis.erroricon} An error occurred while loading the backup` });
      },
      );
    } catch (error) {
      console.log('Error handling button interaction:', error);
    }
  },
};