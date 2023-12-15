const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  structure: new SlashCommandBuilder()
    .setName('avatar')
    .setDescription('👤・Get the avatar of a user.')
    .addUserOption((opt) =>
      opt.setName('user')
        .setDescription('👤・The user whose avatar you want to retrieve.')
        .setRequired(false),
    ),
  /**
     * @param {ExtendedClient} client
     * @param {ChatInputCommandInteraction} interaction
     */
  run: async (client, interaction) => {

    await interaction.deferReply();

    const user = interaction.options.getUser('user') || interaction.user;

    const avatarURL = user.displayAvatarURL({ dynamic: true, size: 4096 });
    try {
      const embed = new EmbedBuilder()
        .setTitle(`${user.username}'s Avatar`)
        .setImage(avatarURL)
        .setColor('Green');

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      global.handle.error(client, interaction.guild.id, interaction.user.id, error);
    }
  },
};