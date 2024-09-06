import { SlashCommandBuilder } from 'discord.js';
import { Snake } from 'discord-gamecord';

module.exports = {
  structure: new SlashCommandBuilder()
    .setName('snake')
    .setDescription('🐍・Play a game of Snake!'),
  options: {
    nsfw: false,
    category: 'Games',
    cooldown: 1,
  },
  /**
   * @param {import('discord.js').Client} client
   * @param {import('discord.js').CommandInteraction} interaction
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
      global.handle.error(client, interaction.guild?.id, interaction.user?.id, error, interaction);
    }
  },
};