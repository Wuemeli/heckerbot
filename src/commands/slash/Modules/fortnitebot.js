const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fnbotSchema = require('../../../schemas/fnbotSchema');
const { createBot, startBot } = require('../../../fn-bot/main');
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

    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('commands')
        .setDescription('📖 Get a list of commands'),
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('edit')
        .setDescription('✏️ Edit your Fortnite Bot')
        .addStringOption(option =>
          option
            .setName('status')
            .setDescription('📝 New Status')
            .setRequired(true),
        )
        .addStringOption(option =>
          option
            .setName('platform')
            .setDescription('📱 New Platform')
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
        .setName('remove')
        .setDescription('🗑️ Remove your Fortnite Bot'),
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
        if (data) return interaction.editReply({ content: `${emojis.erroricon} You already have a Fortnite Bot!`, ephemeral: true });
        try {
          const authcode = interaction.options.getString('authcode');
          const status = interaction.options.getString('status');
          const platform = interaction.options.getString('platform');

          if (status.length > 20) return interaction.editReply({ content: `${emojis.erroricon} Status must be less than 20 characters!`, ephemeral: true });

          const results = await createBot(userId, authcode, status, platform);
          if (results.error) {
            const embed = new EmbedBuilder()
              .setTitle('Error')
              .setDescription(`${emojis.erroricon} ! An error occurred. ${results.message}. If you need help, do \`/fortnite-bot help\``)
              .setColor('Red');
            return interaction.editReply({ embeds: [embed], ephemeral: true });
          } else {
            const embed = new EmbedBuilder()
              .setTitle('Fortnite Bot')
              .setDescription(`${emojis.greendot} Successfully created Fortnite Bot \`${results.botId}\`, \n To get a list of commands, use \`/fortnite-bot commands\`!`)
              .setColor('Green');
            return interaction.editReply({ embeds: [embed], ephemeral: true });
          }
        } catch (error) {
          const embed = new EmbedBuilder()
            .setTitle('Error')
            .setDescription(`${emojis.erroricon} ! An error occurred. Please try again later. Double check your Auth Code. If you need help, do \`/fortnite-bot help\``)
            .setColor('Red');
          return interaction.editReply({ embeds: [embed], ephemeral: true });
        }
      }
      case 'start': {
        const data = await fnbotSchema.findOne({ ownerId: userId });
        if (!data) return interaction.editReply(`${emojis.erroricon} You don't have a Fortnite Bot!`);

        const botData = await startBot(data.botId);

        if (!botData.name) {
          return interaction.editReply(`${emojis.erroricon} Failed to start the bot!`);
        }

        if (botData.started) {
          return interaction.editReply(`${emojis.greendot} Bot \`${botData.name}\` is already running!`);
        }

        const embed = new EmbedBuilder()
          .setTitle('Fortnite Bot')
          .setDescription(`${emojis.greendot} Successfully started Fortnite Bot \`${botData.name}\`, \n To get a list of commands, use \`/fortnite-bot commands\`!`)
          .setColor('Green');

        return interaction.editReply({ embeds: [embed], ephemeral: true });
      }
      case 'help': {
        const embed = new EmbedBuilder()
          .setTitle('Fortnite Bot Help')
          .setColor('Green')
          .setImage('https://camo.githubusercontent.com/0aa2a0e00234bfbafa0c4059ac4f33e66df2d4959c2fcfdb1328f53587ca540c/68747470733a2f2f696d6167652e70726e747363722e636f6d2f696d6167652f73654f3963725f4e526c61524b5758646d32534968772e706e67')
          .setDescription(`
    **Q: How do I create a new Fortnite Bot?**
    A: Use the command \`/fortnite-bot create\`. To get a Auth Code: Create or Login in a **NEW** Epic Games Account and go to this [Link](https://www.epicgames.com/id/api/redirect?clientId=3446cd72694c4a4485d81b77adbb2141&responseType=code). And Copy the code (See Image Below)

    **Q: How do I start my Fortnite Bot?**
    A: Use the command \`/fortnite-bot start\`. You must have already created a bot using the create command.

    **Q: Where can I get help for the Fortnite Bot commands?**
    A: Use the command \`/fortnite-bot commands\` to get a list of commands.
    `);
        return interaction.editReply({ embeds: [embed], ephemeral: true });
      }
      case 'commands': {
        const embed = new EmbedBuilder()
          .setTitle('Fortnite Bot Commands')
          .setDescription('Here is a list of commands. Execute them in the Party Chat.')
          .addFields(
            { name: 'skin', value: '`!skin <skin name>`', inline: true },
            { name: 'emote', value: '`!emote <emote name>`', inline: true },
            { name: 'backpack', value: '`!backpack <backpack name>`', inline: true },
            { name: 'pickaxe', value: '`!pickaxe <pickaxe name>`', inline: true },
            { name: 'ready', value: '`!ready`', inline: true },
            { name: 'unready', value: '`!unready`', inline: true },
            { name: 'gift', value: '`!gift`', inline: true },
            { name: 'hide', value: '`!hide`', inline: true },
            { name: 'unhide', value: '`!unhide`', inline: true },
            { name: 'level', value: '`!level <level>`', inline: true },
            { name: 'default', value: '`!default`', inline: true },
          )
          .setColor('Green');

        return interaction.editReply({ embeds: [embed], ephemeral: true });
      }
      case 'edit': {
        const data = await fnbotSchema.findOne({ ownerId: userId });
        if (!data) return interaction.editReply(`${emojis.erroricon} You don't have a Fortnite Bot!`);

        const status = interaction.options.getString('status');
        const platform = interaction.options.getString('platform');

        if (status.length > 20) return interaction.editReply({ content: `${emojis.erroricon} Status must be less than 20 characters!`, ephemeral: true });

        await fnbotSchema.findOneAndUpdate({ ownerId: userId }, { status, platform });

        const embed = new EmbedBuilder()
          .setTitle('Fortnite Bot')
          .setDescription(`${emojis.greendot} Successfully edited Fortnite Bot!`)
          .setColor('Green');

        return interaction.editReply({ embeds: [embed], ephemeral: true });
      }
      case 'remove': {
        const data = await fnbotSchema.findOne({ ownerId: userId });
        if (!data) return interaction.editReply(`${emojis.erroricon} You don't have a Fortnite Bot!`);

        await fnbotSchema.findOneAndDelete({ ownerId: userId });

        const embed = new EmbedBuilder()
          .setTitle('Fortnite Bot')
          .setDescription(`${emojis.greendot} Successfully removed Fortnite Bot!`)
          .setColor('Green');

        return interaction.editReply({ embeds: [embed], ephemeral: true });
      }
      }
    } catch (error) {
      global.handle.error(client, interaction.guild.id, interaction.user.id, error);
    }
  },
};