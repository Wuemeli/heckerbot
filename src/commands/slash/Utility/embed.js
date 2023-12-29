const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  structure: new SlashCommandBuilder()
    .setName('embed')
    .setDescription('Create a custom embed.')
    .addStringOption(option =>
      option.setName('title')
        .setDescription('The title of the embed.')
        .setRequired(true),
    )
    .addStringOption(option =>
      option.setName('description')
        .setDescription('The description of the embed.')
        .setRequired(true),
    )
    .addStringOption(option =>
      option.setName('color')
        .setDescription('The color of the embed.')
        .setRequired(true)
        .addChoices(
          { name: 'Red', value: '#FF0000' },
          { name: 'Blue', value: '#0000FF' },
          { name: 'Green', value: '#00FF00' },
          { name: 'Yellow', value: '#FFFF00' },
          { name: 'Purple', value: '#800080' },
          { name: 'Orange', value: '#FFA500' },
          { name: 'Pink', value: '#FFC0CB' },
          { name: 'Cyan', value: '#00FFFF' },
          { name: 'Silver', value: '#C0C0C0' },
          { name: 'Gold', value: '#FFD700' },
          { name: 'Black', value: '#000000' },
          { name: 'White', value: '#FFFFFF' },
        ),
    ),
  options: {
    nsfw: false,
    category: 'Utility',
    cooldown: 1,
  },
  /**
   * @param {ExtendedClient} client
   * @param {ChatInputCommandInteraction} interaction
   */
  run: async (client, interaction) => {
    await interaction.deferReply();

    try {
      const title = interaction.options.getString('title');
      const description = interaction.options.getString('description');
      const color = interaction.options.getString('color');

      const embed = new EmbedBuilder()
        .setTitle(title)
        .setDescription(description)
        .setColor(color);

      await interaction.channel.send({ embeds: [embed] });

      await interaction.editReply({ content: 'Embed sent!', ephemeral: true });
    } catch (error) {
      global.handle.error(client, interaction.guild.id, interaction.user.id, error, interaction);
    }
  },
};