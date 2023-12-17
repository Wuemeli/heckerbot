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
        ),
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('start')
        .setDescription('👷・Start your bot.'),
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('delete')
        .setDescription('👷・Delete your bot.'),
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('stop')
        .setDescription('👷・Stop your bot.'),
    ),
  options: {
    nsfw: false,
    category: 'CustomBot',
    cooldown: 1,
  },
  /**
 * @param {ExtendedClient} client
 * @param {ChatInputCommandInteraction} interaction
 */
  run: async (client, interaction) => {
    await interaction.deferReply(
      {
        ephemeral: true,
      },
    );

    try {
      if (!process.env.CUSTOM_BOT_URL) return await interaction.editReply('Custom bot server not configured!');

      switch (interaction.options.getSubcommand()) {
      case 'create': {
        const data = await custombotSchema.findOne({ userId: interaction.user.id });
        if (data) return await interaction.editReply('You already have a bot!');

        const token = interaction.options.getString('token');
        const clientId = interaction.options.getString('clientid');
        const status = interaction.options.getString('status');

        try {
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

          if (response.status === 200) return await interaction.editReply(`${emojis.checkicon} Created bot!`);

        } catch (error) {
          if (error.response.status === 401) return await interaction.editReply(`${emojis.erroricon} Unauthorized!`);
          if (error.response.status === 404) return await interaction.editReply(`${emojis.erroricon} Bot already exists!`);
          if (error.response.status === 500) return await interaction.editReply(`${emojis.erroricon} Failed to create bot!`);
        }
        break;
      }
      case 'delete': {
        const data = await custombotSchema.findOne({ userId: interaction.user.id });
        if (!data) return await interaction.editReply('You don\'t have a bot!');

        try {
          const response = await axios.post(`${process.env.CUSTOM_BOT_URL}/delete`, {
            userId: interaction.user.id,
          }, {
            headers: {
              Authorization: process.env.CUSTOM_BOT_SECRET,
            },
          });
          if (response.status === 200) return await interaction.editReply(`${emojis.checkicon} Deleted bot!`);

        } catch (error) {
          if (error.response.status === 401) return await interaction.editReply(`${emojis.erroricon} Unauthorized!`);
          if (error.response.status === 404) return await interaction.editReply(`${emojis.erroricon} Bot not found!`);
          if (error.response.status === 500) return await interaction.editReply(`${emojis.erroricon} Failed to delete bot!`);
        }
        break;
      }
      case 'start': {
        const data = await custombotSchema.findOne({ userId: interaction.user.id });
        if (!data) return await interaction.editReply('You don\'t have a bot!');

        try {
          const response = await axios.post(`${process.env.CUSTOM_BOT_URL}/start`, {
            clientId: data.clientId,
          }, {
            headers: {
              Authorization: process.env.CUSTOM_BOT_SECRET,
            },
          });


          if (response.status === 200) return await interaction.editReply(`${emojis.checkicon} Started bot!`);
        } catch (error) {
          if (error.response.status === 401) return await interaction.editReply(`${emojis.erroricon} Unauthorized!`);
          if (error.response.status === 404) return await interaction.editReply(`${emojis.erroricon} Bot not found!`);
          if (error.response.status === 409) return await interaction.editReply(`${emojis.erroricon} Bot is already started!`);
          if (error.response.status === 500) return await interaction.editReply(`${emojis.erroricon} Failed to start bot!`);
        }

        break;
      }
      case 'stop': {
        const data = await custombotSchema.findOne({ userId: interaction.user.id });
        if (!data) return await interaction.editReply('You don\'t have a bot!');

        try {
          const response = await axios.post(`${process.env.CUSTOM_BOT_URL}/stop`, {
            clientId: data.clientId,
          }, {
            headers: {
              Authorization: process.env.CUSTOM_BOT_SECRET,
            },
          });

          if (response.status === 200) return await interaction.editReply(`${emojis.checkicon} Stopped bot!`);
        } catch (error) {
          if (error.response.status === 401) return await interaction.editReply(`${emojis.erroricon} Unauthorized!`);
          if (error.response.status === 404) return await interaction.editReply(`${emojis.erroricon} Bot not found!`);
          if (error.response.status === 409) return await interaction.editReply(`${emojis.erroricon} Bot is already stopped!`);
          if (error.response.status === 500) return await interaction.editReply(`${emojis.erroricon} Failed to stop bot!`);
        }

        break;
      }
      }


    } catch (error) {
      global.handle.error(client, interaction.guild.id, interaction.user.id, error);
    }
  },
};
