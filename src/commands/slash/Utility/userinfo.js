const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');
const { time } = require('../../../functions');

module.exports = {
  structure: new SlashCommandBuilder()
    .setName('userinfo')
    .setDescription('👤・Get a user\'s information.')
    .addUserOption((opt) =>
      opt.setName('user')
        .setDescription('The user.')
        .setRequired(false),
    ),
  /**
     * @param {ExtendedClient} client
     * @param {ChatInputCommandInteraction} interaction
     */
  run: async (client, interaction) => {
    await interaction.deferReply();

    try {

      const user = interaction.options.getUser('user') || interaction.user;

      const member = interaction.guild.members.cache.get(user.id);

      if (!member) {
        await interaction.editReply({
          content: 'That user is not on the guild.',
        });
        return;
      }

      const arr = [
        `**Username**: ${user.username}`,
        `**Display name**: ${member.nickname || user.username}`,
        `**ID**: ${user.id}`,
        `**Joined Discord**: ${time(user.createdTimestamp, 'd')} (${time(user.createdTimestamp, 'R')})`,
        `**Joined server**: ${time(member.joinedTimestamp, 'd')} (${time(member.joinedTimestamp, 'R')})`,
      ];

      await interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setTitle('User info - ' + user.username)
            .setThumbnail(member.displayAvatarURL())
            .setDescription(`${arr.join('\n')}`)
            .setColor('Blurple'),
        ],
      });
    } catch (error) {
      global.handle.error(client, interaction.guild.id, interaction.user.id, error);
    }
  },
};