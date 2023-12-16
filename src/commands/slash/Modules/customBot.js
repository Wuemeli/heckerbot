const { SlashCommandBuilder } = require('discord.js');
const { createBot } = require('../../../typescript/custom-bot/main');
const custombotSchema = require('../../../schemas/custombotSchema');
const axios = require('axios');

module.exports = {
  structure: new SlashCommandBuilder()
    .setName('custombot')
    .setDescription('Create your own Discord bot!')
    .addSubcommand(subcommand =>
      subcommand
        .setName('token')
        .setDescription('Create a bot token.')
        .addStringOption(option =>
          option
            .setName('token')
            .setDescription('The token of the bot.')
            .setRequired(true),
        )
        .addStringOption(option =>
          option
            .setName('clientid')
            .setDescription('The client id of the bot.')
            .setRequired(true),
        )
        .addStringOption(option =>
          option
            .setName('status')
            .setDescription('The status of the bot.')
            .setRequired(true),
        ),
    ),
  /**
 * @param {ExtendedClient} client
 * @param {ChatInputCommandInteraction} interaction
 */
  run: async (client, interaction) => {
    await interaction.deferReply();

    try {
      const data = await custombotSchema.findOne({ userId: interaction.user.id });
      if (data) return await interaction.editReply('You already have a bot!');

      const token = interaction.options.getString('token');
      const clientid = interaction.options.getString('clientid');
      const status = interaction.options.getString('status');


      axios.post(`${process.env.CUSTOM_BOT_URL}/create`, {
        token,
        clientId: clientid,
      });

      await interaction.editReply('Created bot!');
    } catch (error) {
      await interaction.editReply('Failed to create bot!');
    }
  },
};
