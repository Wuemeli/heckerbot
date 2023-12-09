const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fnbotSchema = require('../../../schemas/fnbotSchema');
const { createBot, startBot } = require('../../../functions/fn');
const emojis = require('../../../functions/emojis');
const ExtendedClient = require('../../../class/ExtendedClient');

module.exports = {
  structure: new SlashCommandBuilder()
    .setName('fortnite-bot')
    .setDescription('🤖 Fortnite Bot')
    .addSubcommand(subcommand =>
      subcommand
        .setName('create')
        .setDescription('🚧 Create a Fortnite Bot')
        .addStringOption(option =>
          option
            .setName('authcode')
            .setDescription('🔑 Auth Code')
            .setRequired(true),
        )
        .addStringOption(option =>
          option
            .setName('status')
            .setDescription('📝 Status')
            .setRequired(true),
        )
        .addStringOption(option =>
          option
            .setName('platform')
            .setDescription('📱 Platform')
            .setRequired(true),
        ),
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('start')
        .setDescription('🚀 Start a Fortnite Bot'),

    ),
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
      const subcommand = interaction.options.getSubcommand();
      const userId = interaction.user.id;

      switch (subcommand) {
      case 'create': {

        //if (await fnbotSchema.findOne({ ownerId: userId })) return interaction.editReply(`${emojis.error} You already have a Fortnite Bot!`);

        const authcode = interaction.options.getString('authcode');
        const status = interaction.options.getString('status');
        const platform = interaction.options.getString('platform');

        await createBot(userId, authcode, status, platform);

        return interaction.editReply(`${emojis.success} Created Fortnite Bot!`);
      }
      case 'start': {
        const data = await fnbotSchema.findOne({ ownerId: userId });
        if (!data) return interaction.editReply(`${emojis.error} You don't have a Fortnite Bot!`);

        startBot(data.botId);

        return interaction.editReply(`${emojis.success} Started Fortnite Bot!`);
      }
      }
    } catch (err) {
      console.log(err);
      return interaction.editReply(`${emojis.error} An error occurred!`);
    }
  },
};