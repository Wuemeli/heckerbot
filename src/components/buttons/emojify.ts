import { ButtonInteraction, ChannelType } from 'discord.js';
import { ExtendedClient } from '../../class/ExtendedClient';
import { emojify } from '../../functions/functions/emojify';
import emojis from '../../functions/functions/emojis';

export default {
  customId: 'confirm-emoji-rename',
  /**
   * @param {ExtendedClient} client
   * @param {ButtonInteraction} interaction
   */
  run: async (client: ExtendedClient, interaction: ButtonInteraction): Promise<void> => {
    await interaction.deferReply({ ephemeral: true });

    try {
      const prefix = interaction.message.content.split('prefix `')[1].split('`')[0];
      const channels = interaction.guild.channels.cache.filter((channel: any) => channel.type === ChannelType.GuildText);
      for (const [channelID, channel] of Object.entries(channels)) {
        channel.setName(emojify(channel.name) + prefix + channel.name);
        setTimeout(() => { }, 1000);
      }

      await interaction.editReply({ content: `${emojis.checkicon} Renamed all channels.` });
    } catch (error) {
      console.error(error);
      global.handle.error(client, interaction.guild.id, interaction.user.id, error, interaction);
    }
  },
};