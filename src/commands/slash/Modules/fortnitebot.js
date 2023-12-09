const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fnbotSchema = require('../../../schemas/fnbotSchema');
const { createBot, startBot, logout } = require('../../../functions/fn');
const emojis = require('../../../functions/emojis');
const ExtendedClient = require('../../../class/ExtendedClient');

module.exports = {
  structure: new SlashCommandBuilder()
    .setName('fortnite-bot')
    .setDescription('🤖 Fortnite Bot')
    .addSubcommand(subcommand =>
      subcommand
        .setName('create')
        .setDescription('🚧 Create a Fortnite Bot. Do /fortnite-bot help for a full Guide')
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
            .setRequired(true)
            .addChoices(
              { name: 'Windows', value: 'WIN' },
              { name: 'Mac', value: 'MAC' },
              { name: 'iOS', value: 'IOS' },
              { name: 'Android', value: 'AND' },
              { name: 'PlayStation', value: 'PSN' },
              { name: 'Xbox', value: 'XBL' },
              { name: 'Switch', value: 'SWT' },
            ),
        ),
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('start')
        .setDescription('🚀 Start your Fortnite Bot'),

    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('help')
        .setDescription('📖 Help'),

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
        const data = await fnbotSchema.findOne({ ownerId: userId });
        if (data) return interaction.editReply({ content: `${emojis.error} You already have a Fortnite Bot!`, ephemeral: true });
        try {
          const authcode = interaction.options.getString('authcode');
          const status = interaction.options.getString('status');
          const platform = interaction.options.getString('platform');

          if (status.length > 20) return interaction.editReply({ content: `${emojis.error} Status must be less than 20 characters!`, ephemeral: true });

          await createBot(userId, authcode, status, platform);

          const embed = new EmbedBuilder()
            .setTitle('Fortnite Bot')
            .setDescription(`${emojis.greendot} Successfully created Fortnite Bot! \nTo start your Fortnite Bot, use \`/fortnite-bot start\`!`)
            .setColor('Green');

          return interaction.editReply({ embeds: [embed], ephemeral: true });
        } catch (err) {
          const embed = new EmbedBuilder()
            .setTitle('Error')
            .setDescription(`${emojis.error} Oh No! Double check your Auth Code and try again!`)
            .setColor('Red');

          return interaction.editReply({ embeds: [embed], ephemeral: true });
        }
      }
      case 'start': {
        const data = await fnbotSchema.findOne({ ownerId: userId });
        if (!data) return interaction.editReply(`${emojis.error} You don't have a Fortnite Bot!`);

        await startBot(data.botId);

        const embed = new EmbedBuilder()
          .setTitle('Fortnite Bot')
          .setDescription(`${emojis.greendot} Successfully started Fortnite Bot, \n To get a list of commands, use \`/fortnite-bot help\`!`)
          .setColor('Green');

        return interaction.editReply({ embeds: [embed], ephemeral: true });
      }
      case 'help': {
        const embed = new EmbedBuilder()
          .setTitle('Fortnite Bot Help')
          .setDescription(`
      **/fortnite-bot create**
      This command is used to create a new Fortnite Bot. You will need to provide an auth code, status, and platform. The auth code is obtained from Epic Games, the status is a short message that your bot will display, and the platform is the platform your bot will appear to be playing from.

      **/fortnite-bot start**
      This command starts your Fortnite Bot. You must have already created a bot using the create command.

      **/fortnite-bot help**
      This command displays this help message, providing information about the available commands and their usage.
    `)
          .setColor('Green');
        return interaction.editReply({ embeds: [embed], ephemeral: true });
      }
      }
    } catch (err) {
      console.log(err);
      return interaction.editReply(`${emojis.error} An error occurred!`);
    }
  },
};