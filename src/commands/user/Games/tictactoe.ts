// Importing required classes and interfaces from discord.js and discord-gamecord
import { UserContextMenuCommandInteraction, ContextMenuCommandBuilder } from 'discord.js';
import { ExtendedClient } from '../../../class/ExtendedClient'; // Adjust the path as necessary
import { TicTacToe } from 'discord-gamecord';

module.exports = {
  structure: new ContextMenuCommandBuilder()
    .setName('tictactoe')
    .setType(2),
  options: {
    nsfw: false,
    category: 'Games',
    premium: false,
    cooldown: 1,
  },
  /**
   * @param {ExtendedClient} client
   * @param {UserContextMenuCommandInteraction} interaction
   */
  run: async (client: ExtendedClient, interaction: UserContextMenuCommandInteraction) => {
    try {
      const user = interaction.options.getUser('user');

      const game = new TicTacToe({
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
        tieMessage: 'The Game tied No one won the Game!',
        timeoutMessage: 'The Game went unfinished No one won the Game!',
        playerOnlyMessage: 'Only {player} and {opponent} can use these buttons.',
      });
      game.startGame();
    } catch (error) {
      global.handle.error(client, interaction.guild.id, interaction.user.id, error, interaction);
    }
  },
};