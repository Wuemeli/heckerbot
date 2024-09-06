import { Trivia } from 'discord-gamecord';
import { SlashCommandBuilder } from 'discord.js';

module.exports = {
  structure: new SlashCommandBuilder()
    .setName('trivia')
    .setDescription('🧠・Test your knowledge with a trivia question!'),
  options: {
    nsfw: false,
    category: 'Games',
    cooldown: 1,
  },
  /**
   * @param {Client} client
   * @param {CommandInteraction} interaction
   */
  run: async (client, interaction) => {
    try {
      const game = new Trivia({
        message: interaction,
        isSlashGame: true,
        embed: {
          title: 'Trivia',
          color: '#5865F2',
        },
        timeoutTime: 60000,
        buttonStyle: 'PRIMARY',
        winMessage: 'You won! The correct answer was **{answer}**.',
        loseMessage: 'You lost! The correct answer was **{answer}**.',
        timeoutMessage: 'You ran out of time! The correct answer was **{answer}**.',
        playerOnlyMessage: 'Only {player} can use these buttons.',
      });
      game.startGame();
    } catch (error) {
      global.handle.error(client, interaction.guild?.id, interaction.user.id, error, interaction);
    }
  },
};