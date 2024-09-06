import { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ChannelType, ChatInputCommandInteraction, GuildTextBasedChannel } from 'discord.js';
import CountingSchema from '../../../schemas/countingSchema';
import emojis from '../../../functions/functions/emojis';
import ExtendedClient from '../../../class/ExtendedClient';

module.exports = {
  structure: new SlashCommandBuilder()
    .setName('counting')
    .setDescription('🔄・Counting Settings')
    .addSubcommand(subcommand =>
      subcommand
        .setName('channel')
        .setDescription('🔄・Set the Counting Channel')
        .addChannelOption(option =>
          option
            .setName('channel')
            .setDescription('The channel to set')
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true),
        )
        .addStringOption(option =>
          option
            .setName('mode')
            .setDescription('The mode to set')
            .setRequired(true)
            .addChoices(
              { name: 'Normal', value: 'normal' },
              { name: 'No Fail', value: 'nofail' },
              { name: 'Single Count', value: 'singleCount' },
            ),
        ),
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('remove')
        .setDescription('🔄・Remove the Counting Channel'),
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('info')
        .setDescription('🔄・Display the Counting Settings'),
    ),
  options: {
    nsfw: false,
    category: 'Counting',
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

      if (subcommand === 'channel') {
        const channel = interaction.options.getChannel('channel') as GuildTextBasedChannel;
        const guildId = interaction.guild.id;
        const channelId = channel.id;
        const mode = interaction.options.getString('mode', true);

        await CountingSchema.findOneAndUpdate(
          { guildId },
          {
            guildId,
            channelId,
            lastNumber: 0,
            lastUser: null,
            lastMessageId: null,
            countingMode: mode,
          },
          { upsert: true },
        );

        return interaction.editReply({ content: `${emojis.checkicon} Successfully set the counting channel to ${channel}! The counting mode is set to \`${mode}\`.` });
      }

      if (subcommand === 'remove') {
        const guildId = interaction.guild.id;

        await CountingSchema.findOneAndDelete({ guildId });

        return interaction.editReply({ content: `${emojis.checkicon} Successfully removed the counting channel!` });
      }

      if (subcommand === 'info') {
        const guildId = interaction.guild.id;

        const countingData = await CountingSchema.findOne({ guildId });
        if (!countingData) {
          return interaction.editReply({
            content: `${emojis.checkicon} There is no counting channel set! Counting is a fun game where members try to count as high as they can without making a mistake.`,
          });
        }

        const channelData = interaction.guild.channels.cache.get(countingData.channelId!) as GuildTextBasedChannel;

        const embed = new EmbedBuilder()
          .setTitle('Counting Settings')
          .setColor('Green')
          .setTimestamp();

        if (channelData) {
          embed.addFields({ name: 'Channel', value: channelData.toString(), inline: true });
        }

        embed.addFields({ name: 'Last Number', value: countingData.lastNumber.toString(), inline: true });

        if (countingData.lastUser) {
          const userData = interaction.guild.members.cache.get(countingData.lastUser);

          if (userData) {
            embed.addFields({ name: 'Last User', value: userData.toString(), inline: true });
          }
        }

        if (countingData.lastMessageId) {
          try {
            const messageData = await channelData.messages.fetch(countingData.lastMessageId);

            if (messageData) {
              embed.addFields({ name: 'Last Message', value: messageData.toString(), inline: true });
            }
          } catch (error) {
            console.error(`Failed to fetch message: ${error}`);
          }
        }

        if (countingData.countingMode) {
          embed.addFields({ name: 'Mode', value: countingData.countingMode, inline: true });
        }

        return interaction.editReply({ embeds: [embed] });
      }
    } catch (error) {
      global.handle.error(client, interaction.guild?.id || 'Unknown Guild', interaction.user.id, error, interaction);
    }
  },
};
