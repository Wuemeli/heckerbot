const { FastType } = require('discord-gamecord');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { random_sentence } = require('../../../functions/functions/random-sentence');

module.exports = {
  structure: new SlashCommandBuilder()
    .setName('fasttype')
    .setDescription('🎮・Play the fast type game!'),
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
      const sentence = await random_sentence();

      const Game = new FastType({
        message: interaction,
        isSlashGame: true,
        embed: {
          title: 'Fast Type',
          color: '#5865F2',
          description: 'You have {time} seconds to type the sentence below.',
        },
        timeoutTime: 60000,
        sentence: sentence,
        winMessage: 'You won! You finished the type race in {time} seconds with wpm of {wpm}.',
        loseMessage: 'You lost! You didn\'t type the correct sentence in time.',
      });

      Game.startGame();
    } catch (error) {
      global.handle.error(client, interaction.guild.id, interaction.user.id, error);
    }
  },
};