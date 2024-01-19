const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const welcomeSchema = require('../../../schemas/welcomeSchema');
const emojis = require('../../../functions/functions/emojis');
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
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(false),
        )
        .addStringOption((opt) =>
          opt
            .setName('message')
            .setDescription('Placeholders: .user .guild .membercount')
            .setRequired(false),
        )
        .addRoleOption((opt) =>
          opt
            .setName('role')
            .setDescription('The role that gets added to the user')
            .setRequired(false),
        ),
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('remove')
        .setDescription('🔄 Remove the Welcome Channel'),
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
      const role = interaction.options.getRole('role');
      const guildId = interaction.guild.id;
      const channelId = channel?.id;

      if (subcommand === 'channel') {
        if (!channelId) {
          return interaction.editReply({ content: `${emojis.erroricon} You need to specify a channel!` });
        } else if (!message) {
          return interaction.editReply({ content: `${emojis.erroricon} You need to specify a message!` });
        }

        await welcomeSchema.findOneAndUpdate({
          guildId,
        }, {
          guildId,
          channelId,
          welcomeMessage: message,
          welcomeRole: role?.id,
        }, {
          upsert: true,
        });


        const embed = new EmbedBuilder()
          .setTitle('Welcome Settings')
          .setColor('Green')
          .setTimestamp()
          .addFields(
            { name: 'Channel', value: channel, inline: true },
            { name: 'Message', value: message, inline: true },
            { name: 'Role', value: role ? `<@&${role.id}>` : 'None', inline: true },
          );

        return interaction.editReply({ embeds: [embed] });
      }

      if (subcommand === 'remove') {
        await welcomeSchema.findOneAndDelete({
          guildId,
        });

        return interaction.editReply({ content: `${emojis.checkicon} Successfully removed the welcome system!` });
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
        .addFields(
          { name: 'Channel', value: channelData, inline: true },
          { name: 'Message', value: welcomeData.welcomeMessage, inline: true },
          { name: 'Role', value: welcomeData.welcomeRole ? `<@&${welcomeData.welcomeRole}>` : 'None', inline: true },
        )
        .setTimestamp();

      return interaction.editReply({ embeds: [embed] });
    }
    catch (error) {
      console.log(error);
      global.handle.error(client, interaction.guild.id, interaction.user.id, error, interaction);
    }
  },
};