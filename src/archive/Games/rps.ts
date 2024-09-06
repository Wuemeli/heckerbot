import { RockPaperScissors } from 'discord-gamecord';
import { SlashCommandBuilder, CommandInteraction, GuildMember } from 'discord.js';

module.exports = {
  structure: new SlashCommandBuilder()
    .setName('rps')
    .setDescription('✊✋・Play a game of Rock Paper Scissors!')
    .addUserOption((option) =>
      option.setName('opponent')
        .setDescription('🔥 The user to play with.')
        .setRequired(true),
    ),
  options: {
    nsfw: false,
    category: 'Games',
    cooldown: 1,
  },
  /**
   * @param {import('discord.js').Client} client
   * @param {CommandInteraction} interaction
   */
  run: async (client, interaction) => {
    try {
      const Game = new RockPaperScissors({
        message: interaction,
        isSlashGame: true,
        opponent: interaction.options.getUser('opponent') as GuildMember,
        embed: {
          title: 'Rock Paper Scissors',
          color: '#5865F2',
        },
        mentionUser: true,
        timeoutTime: 60000,
        buttonStyle: 'PRIMARY',
        pickMessage: 'You choose {emoji}.',
        winMessage: '**{player}** won the Game! Congratulations!',
        tieMessage: 'The Game tied! No one won the Game!',
        timeoutMessage: 'The Game went unfinished! No one won the Game!',
        playerOnlyMessage: 'Only {player} and {opponent} can use these buttons.',
      });

      Game.startGame();
    } catch (error) {
      global.handle.error(client, interaction.guild?.id, interaction.user.id, error, interaction);
    }
  },
};