import { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ChannelType, Role, TextChannel } from 'discord.js';
import welcomeSchema from '../../../schemas/welcomeSchema';
import emojis from '../../../functions/functions/emojis';

module.exports = {
  structure: new SlashCommandBuilder()
    .setName('welcome')
    .setDescription('👋 Welcome Settings')
    .addSubcommand(subcommand =>
      subcommand
        .setName('channel')
        .setDescription('🔄 Set the Welcome Channel & Message')
        .addChannelOption(option =>
          option
            .setName('channel')
            .setDescription('The channel to set')
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(false),
        )
        .addStringOption(option =>
          option
            .setName('message')
            .setDescription('Placeholders: .user .guild .membercount')
            .setRequired(false),
        )
        .addRoleOption(option =>
          option
            .setName('role')
            .setDescription('The role that gets added to the user')
            .setRequired(false),
        ),
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('remove')
        .setDescription('🔄 Remove the Welcome Channel'),
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('info')
        .setDescription('🔄 Shows the Welcome Info'),
    ),
  options: {
    nsfw: false,
    category: 'Welcome',
    cooldown: 1,
  },
  /**
   * @param {ExtendedClient} client
   * @param {ChatInputCommandInteraction} interaction
   */
  run: async (client, interaction) => {
    await interaction.deferReply({ ephemeral: true });

    try {
      if (!interaction.member?.permissions.has(PermissionFlagsBits.ManageGuild)) {
        return interaction.editReply({ content: `${emojis.erroricon} You need the \`Manage Server\` permission to use this command!` });
      }

      const subcommand = interaction.options.getSubcommand();
      const channel = interaction.options.getChannel('channel') as TextChannel | null;
      const message = interaction.options.getString('message');
      const role = interaction.options.getRole('role') as Role | null;
      const guildId = interaction.guild.id;
      const channelId = channel?.id;

      if (subcommand === 'channel') {
        if (!channelId) {
          return interaction.editReply({ content: `${emojis.erroricon} You need to specify a channel!` });
        } else if (!message) {
          return interaction.editReply({ content: `${emojis.erroricon} You need to specify a message!` });
        }

        await welcomeSchema.findOneAndUpdate(
          { guildId },
          {
            guildId,
            channelId,
            welcomeMessage: message,
            welcomeRole: role?.id,
          },
          { upsert: true },
        );

        const embed = new EmbedBuilder()
          .setTitle('Welcome Settings')
          .setColor('Green')
          .setTimestamp()
          .addFields(
            { name: 'Channel', value: channel.name, inline: true },
            { name: 'Message', value: message, inline: true },
            { name: 'Role', value: role ? `<@&${role.id}>` : 'None', inline: true },
          );

        return interaction.editReply({ embeds: [embed] });
      }

      if (subcommand === 'remove') {
        await welcomeSchema.findOneAndDelete({ guildId });

        return interaction.editReply({ content: `${emojis.checkicon} Successfully removed the welcome system!` });
      }

      if (subcommand === 'info') {
        const data = await welcomeSchema.findOne({ guildId });
        if (!data) {
          return interaction.editReply({ content: `${emojis.erroricon} There is no welcome system!` });
        }

        const { channelId, welcomeMessage: message, welcomeRole: role } = data;

        const channel = interaction.guild.channels.cache.get(channelId) as TextChannel | undefined;
        const embed = new EmbedBuilder()
          .setTitle('Welcome Settings')
          .setColor('Green')
          .setTimestamp()
          .addFields(
            { name: 'Channel', value: channel ? channel.name : 'Unknown', inline: true },
            { name: 'Message', value: message, inline: true },
            { name: 'Role', value: role ? `<@&${role}>` : 'None', inline: true },
          );

        return interaction.editReply({ embeds: [embed] });
      }

    } catch (error) {
      global.handle.error(client, interaction.guild?.id || 'Unknown Guild', interaction.user.id, error, interaction);
    }
  },
};
