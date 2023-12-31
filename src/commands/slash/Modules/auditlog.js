const { SlashCommandBuilder, ChannelType, PermissionFlagsBits } = require('discord.js');
const auditlogSchema = require('../../../schemas/auditlogSchema');
const emojis = require('../../../functions/functions/emojis');

module.exports = {
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
    await interaction.deferReply(
      {
        ephemeral: true,
      },
    );

    try {
      if (!interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)) {
        return interaction.editReply({ content: `${emojis.erroricon} You need the \`Manage Server\` permission to use this command!` });
      }

      const guildId = interaction.guild.id;
      const subcommand = interaction.options.getSubcommand();

      if (subcommand === 'channel') {
        const channelId = interaction.options.getChannel('channel').id;

        await auditlogSchema.findOneAndUpdate(
          {
            guildId: guildId,
          },
          {
            guildId: guildId,
            channelId: channelId,
          },
          {
            upsert: true,
          },
        );

        await interaction.editReply({
          content: `${emojis.checkicon} The Audit Log Channel has been set to <#${channelId}>`,
        });
      } else if (subcommand === 'remove') {
        await auditlogSchema.findOneAndDelete({
          guildID: guildId,
        });

        await interaction.editReply({
          content: `${emojis.checkicon} The Audit Log Channel has been removed`,
        });
      }
    } catch (error) {
      console.error(error);
    }
  },
};