const { FindEmoji } = require('discord-gamecord');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  structure: new SlashCommandBuilder()
    .setName('findemoji')
    .setDescription('🔎 Play a game of Find Emoji!'),
  /**
   * @param {ExtendedClient} client
   * @param {ChatInputCommandInteraction} interaction
   */
  run: async (client, interaction) => {
    try {
      const Game = new FindEmoji({
        message: interaction,
        isSlashGame: true,
        embed: {
          title: 'Find Emoji',
          color: '#5865F2',
          description: 'Remember the emojis from the board below.',
          findDescription: 'Find the {emoji} emoji before the time runs out.',
        },
        timeoutTime: 60000,
        hideEmojiTime: 5000,
        buttonStyle: 'PRIMARY',
        emojis: ['🍉', '🍇', '🍊', '🍋', '🥭', '🍎', '🍏', '🥝'],
        winMessage: 'You won! You selected the correct emoji. {emoji}',
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