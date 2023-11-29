const { MatchPairs } = require('discord-gamecord');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  structure: new SlashCommandBuilder()
    .setName('matchpairs')
    .setDescription('🔀 Play the Match Pairs game!'),
  /**
   * @param {ExtendedClient} client
   * @param {ChatInputCommandInteraction} interaction
   */
  run: async (client, interaction) => {
    await interaction.deferReply();
    try {
      const Game = new MatchPairs({
        message: interaction,
        isSlashGame: true,
        embed: {
          title: 'Match Pairs',
          color: '#5865F2',
          description: '**Click on the buttons to match emojis with their pairs.**',
        },
        timeoutTime: 60000,
        buttonStyle: 'PRIMARY',
        emojis: ['🍉', '🍇', '🍊', '🍋', '🥭', '🍎', '🍏', '🥝', '🍒', '🍓', '🍑', '🍍'],        winMessage: 'You won! You selected the correct emoji. {emoji}',
        loseMessage: 'You lost! You selected the wrong emoji. {emoji}',
        timeoutMessage: 'You lost! You ran out of time. The emoji is {emoji}',
        playerOnlyMessage: 'Only {player} can use these buttons.',
      });
      Game.startGame();
    } catch (error) {
      global.handle.error(client, interaction.guild.id, interaction.user.id, error);
    }
  },
};