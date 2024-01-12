const { ButtonInteraction, ChannelType } = require('discord.js');
const ExtendedClient = require('../../class/ExtendedClient');
const { emojify } = require('../../functions/functions/emojify');
const emojis = require('../../functions/functions/emojis');

module.exports = {
  customId: 'confirm-emoji-rename',
  /**
   * @param {ExtendedClient} client
   * @param {ButtonInteraction} interaction
   */
  run: async (client, interaction) => {
    await interaction.deferReply({ ephemeral: true });

    try {
      const prefix = interaction.message.content.split('prefix `')[1].split('`')[0];
      const channels = interaction.guild.channels.cache.filter(channel => channel.type === ChannelType.GuildText);
      for (const [channelID, channel] of channels) {
        channel.setName(emojify(channel.name) + prefix + channel.name);
        setTimeout(() => {}, 1000);
      }

      await interaction.editReply({ content: `${emojis.checkicon} Renamed all channels.` });
    } catch (error) {
      console.error(error);
      global.handle.error(client, interaction.guild.id, interaction.user.id, error, interaction);
    }
  },
};