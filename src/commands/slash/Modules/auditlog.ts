import { SlashCommandBuilder, ChannelType, PermissionFlagsBits, ChatInputCommandInteraction, CommandInteractionOptionResolver } from 'discord.js';
import auditlogSchema from '../../../schemas/auditlogSchema';
import emojis from '../../../functions/functions/emojis';

export default {
  structure: new SlashCommandBuilder()
    .setName('auditlog')
    .setDescription('📓・Audit Log Settings')
    .addSubcommand(subcommand =>
      subcommand
        .setName('channel')
        .setDescription('📓・Sets the Audit Log Channel')
        .addChannelOption(option =>
          option
            .setName('channel')
            .setDescription('📓・The Audit Log Channel')
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true),
        ),
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('remove')
        .setDescription('💥・Removes the Audit Log Channel'),
    ),
  options: {
    nsfw: false,
    category: 'Auditlog',
    cooldown: 1,
  },

  /**
   * @param {ExtendedClient} client
   * @param {ChatInputCommandInteraction} interaction
   */
  run: async (client, interaction) => {
    await interaction.deferReply({ ephemeral: true });

    try {
      if (!interaction.memberPermissions?.has(PermissionFlagsBits.ManageGuild)) {
        return interaction.editReply({
          content: `${emojis.erroricon} You need the \`Manage Server\` permission to use this command!`,
        });
      }

      const guildId = interaction.guild?.id as string;
      const subcommand = interaction.options.getSubcommand();

      if (subcommand === 'channel') {
        const channel = interaction.options.getChannel('channel', true);
        const channelId = channel.id;

        await auditlogSchema.findOneAndUpdate(
          { guildId: guildId },
          { guildId: guildId, channelId: channelId },
          { upsert: true }
        );

        await interaction.editReply({
          content: `${emojis.checkicon} The Audit Log Channel has been set to <#${channelId}>`,
        });
      } else if (subcommand === 'remove') {
        await auditlogSchema.findOneAndDelete({ guildId: guildId });

        await interaction.editReply({
          content: `${emojis.checkicon} The Audit Log Channel has been removed`,
        });
      }
    } catch (error) {
      global.handle.error(client, interaction.guild?.id || 'Unknown Guild', interaction.user.id, error, interaction);
    }
  },
};
