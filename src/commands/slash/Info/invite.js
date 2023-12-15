const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  structure: new SlashCommandBuilder()
    .setName('invite')
    .setDescription('💌・Get the invite link for the bot.'),
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
      const embed = new EmbedBuilder()
        .setTitle('💌 Invite')
        .setColor('Green')
        .setDescription(`Click the Link to invite me to your server: [Invite](https://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot%20applications.commands&permissions=8)`);

      interaction.editReply({ embeds: [embed] });
    } catch (error) {
      global.handle.error(client, interaction.guild.id, interaction.user.id, error);
    }
  },
};
