const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');
const custombotSchema = require('../../../schemas/custombotSchema');
const emojis = require('../../../functions/emojis');

module.exports = {
  structure: new SlashCommandBuilder()
    .setName('custombot')
    .setDescription('👷・Create your own Discord bot!')
    .addSubcommand(subcommand =>
      subcommand
        .setName('create')
        .setDescription('👷・Create your Custom Discord Bot.')
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
        )
        .addSubcommand(subcommand =>
          subcommand
            .setName('delete')
            .setDescription('👷・Delete your bot.'),
        ),
    ),
  /**
 * @param {ExtendedClient} client
 * @param {ChatInputCommandInteraction} interaction
 */
  run: async (client, interaction) => {
    await interaction.deferReply();

    try {
      if (!process.env.CUSTOM_BOT_URL) return await interaction.editReply('Custom bot server not configured!');
      const data = await custombotSchema.findOne({ userId: interaction.user.id });
      if (data) return await interaction.editReply('You already have a bot!');

      switch (interaction.options.getSubcommand()) {
      case 'create': {
        const token = interaction.options.getString('token');
        const clientId = interaction.options.getString('clientid');
        const status = interaction.options.getString('status');

        const response = await axios.post(`${process.env.CUSTOM_BOT_URL}/create`, {
          userId: interaction.user.id,
          token,
          clientId,
          status,
        }, {
          headers: {
            Authorization: process.env.CUSTOM_BOT_SECRET,
          },
        });
        if (response.status === 409) return await interaction.editReply(`${emojis.erroricon} You already have a bot!`);
        if (response.status === 500) return await interaction.editReply(`${emojis.erroricon} Failed to create bot!`);
        if (response.status === 201) return await interaction.editReply(`${emojis.successicon} Created bot!`);
        break;
      }
      case 'delete': {
        const response = await axios.post(`${process.env.CUSTOM_BOT_URL}/delete`, {
          userId: interaction.user.id,
        }, {
          headers: {
            Authorization: process.env.CUSTOM_BOT_SECRET,
          },
        });
        if (response.status === 404) return await interaction.editReply(`${emojis.erroricon} Bot not found!`);
        if (response.status === 500) return await interaction.editReply(`${emojis.erroricon} Failed to delete bot!`);
        if (response.status === 200) return await interaction.editReply(`${emojis.successicon} Deleted bot!`);
      }
      }

    } catch (error) {
      global.handle.error(client, interaction.guild.id, interaction.user.id, error);
    }
  },
};
