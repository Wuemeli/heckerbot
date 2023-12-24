const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const ms = require('ms');
const reminderSchema = require('../../../schemas/reminderSchema');
const { time } = require('../../../functions/functions/consolelog');

module.exports = {
  structure: new SlashCommandBuilder()
    .setName('reminder')
    .setDescription('⏰・Set a Reminder that will DM you after the time you set.')
    .addStringOption(option =>
      option
        .setName('time')
        .setDescription('⏰・Example: 1d, 1h, 1m, 1s')
        .setRequired(true),
    )
    .addStringOption(option =>
      option
        .setName('message')
        .setDescription('📝・The Message you want to be reminded with.')
        .setRequired(true),
    ),
  options: {
    nsfw: false,
    category: 'Utility',
    cooldown: 1,
  },
  /**
     * @param {ExtendedClient} client
     * @param {ChatInputCommandInteraction} interaction
     */
  run: async (client, interaction) => {

    await interaction.deferReply({ ephemeral: true });

    try {

      const timedata = interaction.options.getString('time');
      const message = interaction.options.getString('message');

      const parsed = ms(timedata);

      if (!parsed) {
        const embed = new EmbedBuilder()
          .setColor('#FF0000')
          .setTitle('❌・Error')
          .setDescription('Please provide a valid time.');

        return interaction.editReply({
          embeds: [embed],
          ephemeral: true,
        });
      }

      await new reminderSchema({
        userID: interaction.user.id,
        time: Date.now() + parsed,
        message,
      }).save();

      const timestamp = Date.now() + parsed;

      const embed = new EmbedBuilder()
        .setColor('#00FF00')
        .setTitle('📝・Reminder')
        .setDescription(`I will remind you on ${time(timestamp)} with ${message}.`);

      return interaction.editReply({
        embeds: [embed],
        ephemeral: true,
      });
    } catch (error) {
      global.handle.error(client, interaction.guild.id, interaction.user.id, error);
    }
  },
};