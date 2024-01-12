const { SlashCommandBuilder, PermissionFlagsBits, ChannelType, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { emojify } = require('../../../functions/functions/emojify');
const emojis = require('../../../functions/functions/emojis');

module.exports = {
  structure: new SlashCommandBuilder()
    .setName('emojichannels')
    .setDescription('😊・Add emojis to all channel names.')
    .addStringOption(
      option => option
        .setName('prefix')
        .setDescription('The Emoji that is placed between the emoji and the channel name. Must be a unicode emoji.')
        .setRequired(true),
    ),
  options: {
    nsfw: false,
    category: 'Info',
    cooldown: 1,
  },
  /**
     * @param {ExtendedClient} client
     * @param {ChatInputCommandInteraction} interaction
     */
  run: async (client, interaction) => {
    await interaction.deferReply(
      {
        ephemeral: true,
      },
    );

    try {
      const prefix = interaction.options.getString('prefix');

      if (!isUnicodeEmoji(prefix)) {
        await interaction.editReply({ content: `${emojis.erroricon} The prefix must be a unicode emoji.` });
        return;
      }

      const channels = interaction.guild.channels.cache.filter(channel => channel.type === ChannelType.GuildText);
      const preview = channels.map(channel => emojify(channel.name) + prefix + channel.name).join('\n');
      await interaction.editReply({
        content: `Here is a preview of the channel names with emojis:\n\`${preview}\` \n with the prefix \`${prefix}\` \n\nDo you want to continue?`,
        components: [
          new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId('confirm-emoji-rename')
              .setLabel('Confirm Rename')
              .setStyle(ButtonStyle.Danger),
          ),
        ],
      });
    } catch (error) {
      global.handle.error(client, interaction.guild.id, interaction.user.id, error, interaction);
    }
  },
};

function isUnicodeEmoji(str) {
  const regexEmoji = /^(\p{Emoji}|\p{Extended_Pictographic}|・)+$/u;
  return regexEmoji.test(str);
}
