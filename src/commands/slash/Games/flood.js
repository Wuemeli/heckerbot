const { Flood } = require('discord-gamecord');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  structure: new SlashCommandBuilder()
    .setName('flood')
    .setDescription('🧨・Play the Flood game!'),
  options: {
    nsfw: false,
    category: 'Games',
    cooldown: 1,
  },
  /**
   * @param {ExtendedClient} client
   * @param {ChatInputCommandInteraction} interaction
   */
  run: async (client, interaction) => {
    try {
      const difficulty = Math.floor(Math.random() * 3) + 1;

      const Game = new Flood({
        message: interaction,
        isSlashGame: true,
        embed: {
          title: 'Flood',
          color: '#5865F2',
        },
        difficulty,
        timeoutTime: 60000,
        buttonStyle: 'PRIMARY',
        emojis: ['🟥', '🟦', '🟧', '🟪', '🟩'],
        winMessage: 'You won! You took **{turns}** turns.',
        loseMessage: 'You lost! You took **{turns}** turns.',
        playerOnlyMessage: 'Only {player} can use these buttons.',
      });
      Game.startGame();
    } catch (error) {
      global.handle.error(client, interaction.guild.id, interaction.user.id, error);
    }
  },
};