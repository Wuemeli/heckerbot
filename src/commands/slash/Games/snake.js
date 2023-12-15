const { Snake } = require('discord-gamecord');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  structure: new SlashCommandBuilder()
    .setName('snake')
    .setDescription('🐍・Play a game of Snake!'),
  /**
   * @param {ExtendedClient} client
   * @param {ChatInputCommandInteraction} interaction
   */
  run: async (client, interaction) => {
    try {
      const Game = new Snake({
        message: interaction,
        isSlashGame: true,
        embed: {
          title: 'Snake',
          color: '#5865F2',
        },
        timeoutTime: 60000,
        buttonStyle: 'PRIMARY',
        winMessage: 'You won with a score of {score}!',
        loseMessage: 'You lost with a score of {score}!',
        cancelMessage: 'You cancelled the game.',
        awaitingMessage: 'Waiting for the opponent...',
        opponentMessage: 'Your opponent is {opponent}',
        playerOnlyMessage: 'Only {player} can use these buttons.',
      });
      Game.startGame();
    } catch (error) {
      global.handle.error(client, interaction.guild.id, interaction.user.id, error);
    }
  },
};