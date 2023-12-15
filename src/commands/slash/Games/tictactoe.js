const { TicTacToe } = require('discord-gamecord');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  structure: new SlashCommandBuilder()
    .setName('tictactoe')
    .setDescription('❌・Play a game of Tic Tac Toe with a friend!')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('🔥 The user to play with.')
        .setRequired(true),
    ),
  /**
   * @param {ExtendedClient} client
   * @param {ChatInputCommandInteraction} interaction
   */
  run: async (client, interaction) => {
    try {
      const user = interaction.options.getUser('user');

      const Game = new TicTacToe({
        message: interaction,
        isSlashGame: true,
        opponent: user,
        embed: {
          title: 'Tic Tac Toe',
          color: '#5865F2',
          statusTitle: 'Status',
          overTitle: 'Game Over',
        },
        emojis: {
          xButton: '❌',
          oButton: '🔵',
          blankButton: '➖',
        },
        mentionUser: true,
        timeoutTime: 60000,
        xButtonStyle: 'DANGER',
        oButtonStyle: 'PRIMARY',
        turnMessage: '{emoji} | Its turn of player **{player}**.',
        winMessage: '{emoji} | **{player}** won the TicTacToe Game.',
        tieMessage: 'The Game tied! No one won the Game!',
        timeoutMessage: 'The Game went unfinished! No one won the Game!',
        playerOnlyMessage: 'Only {player} and {opponent} can use these buttons.',
      });
      Game.startGame();
    } catch (error) {
      global.handle.error(client, interaction.guild.id, interaction.user.id, error);
    }
  },
};