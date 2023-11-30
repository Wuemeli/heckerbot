const {ChatInputCommandInteraction, SlashCommandBuilder} = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');
const emojis = require('../../../functions/emojis');

module.exports = {
  structure: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('🐕‍🦺 Returns the Ping to the Discord Servers'),
  options: {
    cooldown: 5000,
  },
  /**
     * @param {ExtendedClient} client
     * @param {ChatInputCommandInteraction} interaction
     */
  run: async (client, interaction) => {
    await interaction.deferReply({
      ephemeral: true,
    });

    try {

      await interaction.editReply({
        content: `${emojis.greendot} ${client.ws.ping}ms`,
      });
    } catch (error) {
      global.handle.error(client, interaction.guild.id, interaction.user.id, error);
    }
  },
};
