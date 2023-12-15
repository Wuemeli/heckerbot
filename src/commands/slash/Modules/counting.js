const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const CountingSchema = require('../../../schemas/countingSchema');
const emojis = require('../../../functions/emojis');
const ExtendedClient = require('../../../class/ExtendedClient');

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
            .setRequired(true),
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

      const subcommand = interaction.options.getSubcommand();
      const channel = interaction.options.getChannel('channel');
      const guildId = interaction.guild.id;
      const channelId = channel?.id;

      if (subcommand === 'channel') {
        if (!channelId) {
          return interaction.editReply({ content: `${emojis.erroricon} You need to specify a channel!` });
        }

        await CountingSchema.findOneAndUpdate({
          guildId,
        }, {
          guildId,
          channelId,
          lastNumber: 0,
          lastUser: null,
          lastMessageId: null,
        }, {
          upsert: true,
        });

        return interaction.editReply({ content: `${emojis.checkicon} Successfully set the counting channel to ${channel}!` });
      }

      if (subcommand === 'remove') {
        await CountingSchema.findOneAndDelete({
          guildId,
        });

        return interaction.editReply({ content: `${emojis.checkicon} Successfully removed the counting channel!` });
      }

      if (subcommand === 'info') {
        const countingData = await CountingSchema.findOne({
          guildId,
        });

        if (!countingData) {
          return interaction.editReply({
            content: `${emojis.checkicon} There is no counting channel set! Counting is a fun game where members try to count as high as they can without making a mistake.` });
        }

        const channelData = interaction.guild.channels.cache.get(countingData.channelId);

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
          const messageData = await channelData.messages.fetch(countingData.lastMessageId);

          if (messageData) {
            embed.addFields({ name: 'Last Message', value: messageData.toString(), inline: true });
          }
        }

        return interaction.editReply({ embeds: [embed] });
      }
    } catch (error) {
      global.handle.error(client, interaction.guild.id, interaction.user.id, error);
    }
  },
};