const {SlashCommandBuilder, EmbedBuilder} = require('discord.js');

module.exports = {
  structure: new SlashCommandBuilder()
    .setName('qrcode')
    .setDescription('📱・Generate a QR code.')
    .addStringOption((option) =>
      option.setName('value')
        .setDescription('The value you want to generate a QR code for.')
        .setRequired(true),
    ),
  options: {
    nsfw: false,
    category: 'Tools',
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

    const value = interaction.options.getString('value');

    try {
      const qrEmbed = new EmbedBuilder()
        .setTitle('📱 QR Code')
        .setColor('Green')
        .setImage(`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${value}`);

      await interaction.editReply({embeds: [qrEmbed]});
    } catch (error) {
      global.handle.error(client, interaction.guild.id, interaction.user.id, error, interaction);
    }
  },
};
