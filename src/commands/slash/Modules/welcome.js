const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const welcomeSchema = require('../../../schemas/welcomeSchema');
const emojis = require('../../../functions/emojis');
const ExtendedClient = require('../../../class/ExtendedClient');

module.exports = {
  structure: new SlashCommandBuilder()
    .setName('welcome')
    .setDescription('👋 Welcome Settings')
    .addSubcommand(subcommand =>
      subcommand
        .setName('channel')
        .setDescription('🔄 Set the Welcome Channel&Message')
        .addChannelOption(option =>
          option
            .setName('channel')
            .setDescription('The channel to set')
            .setRequired(true),
        )
        .addStringOption((opt) =>
          opt.setName('message')
            .setDescription('Placeholders: .user .guild .membercount')
            .setRequired(true),
        )
        .addChannelOption(option =>
          option
            .setName('picture')
            .setDescription('The picture to set')
            .setRequired(false),
        ),
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('remove')
        .setDescription('🔄 Remove the Welcome Channel'),
    ),
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

      const subcommand = interaction.options.getSubcommand();
      const channel = interaction.options.getChannel('channel');
      const message = interaction.options.getString('message');
      const picture = interaction.options.getString('picture');
      const guildId = interaction.guild.id;
      const channelId = channel?.id;

      if (subcommand === 'channel') {
        if (!channelId) {
          return interaction.editReply({ content: `${emojis.erroricon} You need to specify a channel!` });
        }

        await welcomeSchema.findOneAndUpdate({
          guildId,
        }, {
          guildId,
          channelId,
          welcomeMessage: message,
          welcomePicture: picture,
        }, {
          upsert: true,
        });

        return interaction.editReply({ content: `${emojis.checkicon} Successfully set the counting channel to ${channel}!` });
      }

      if (subcommand === 'remove') {
        await welcomeSchema.findOneAndDelete({
          guildId,
        });

        return interaction.editReply({ content: `${emojis.checkicon} Successfully removed the counting channel!` });
      }

      const welcomeData = await welcomeSchema.findOne({
        guildId,
      });

      if (!welcomeData) {
        return interaction.editReply({ content: `${emojis.erroricon} There is no welcome channel set!` });
      }


      const channelData = interaction.guild.channels.cache.get(welcomeData.channelId);

      const embed = new EmbedBuilder()
        .setTitle('Welcome Settings')
        .setColor('Green')
        .setTimestamp();

      if (channelData) {
        embed.addField('Channel', channelData, true);
        embed.addField('Message', welcomeData.welcomeMessage, true);
        embed.addField('Picture', welcomeData.welcomePicture, true);
      }

      return interaction.editReply({ embeds: [embed] });
    }
    catch (error) {
      global.handle.error(client, interaction.guild.id, interaction.user.id, error);
    }
  },
};