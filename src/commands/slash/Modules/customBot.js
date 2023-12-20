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
            .setDescription('Placeholders: {guilds}, {users}')
            .setRequired(true),
        ),
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('delete')
        .setDescription('👷・Delete your bot.'),
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('help')
        .setDescription('👷・Get Help how to use this Feature.'),
    ),
  options: {
    nsfw: false,
    category: 'CustomBot',
    premium: true,
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
      if (!process.env.CUSTOM_BOT_URL) return await interaction.editReply(`${emojis.checkicon} Custom bot server hasnt been configured!`);

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
          console.log(error.response.status);
          if (error.response.status === 401) return await interaction.editReply(`${emojis.erroricon} Unauthorized!  \n Double check your token and client id! And be sure to have all intents enabled!  \n Do /custombot help for more information!`);
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
          if (error.response.status === 401) return await interaction.editReply(`${emojis.erroricon} Unauthorized! If this error keeps happening, please contact the support!`);
          if (error.response.status === 404) return await interaction.editReply(`${emojis.erroricon} Bot not found!`);
          if (error.response.status === 500) return await interaction.editReply(`${emojis.erroricon} Failed to delete bot!`);
        }
        break;
      }
      case 'help': {
        await interaction.editReply({
          embeds: [
            {
              title: 'Custom Bot Help',
              description: 'Create your own Discord bot with this feature!',
              fields: [
                {
                  name: 'Create',
                  value: 'For this Feature you need a Discord Bot Token and a Client ID. \n You can get them from the [Discord Developer Portal](https://discord.com/developers/applications). \n After you created your Application, you can copy the Token and the Client ID from the Bot Section. \n Be sure to have ALL Intents enabled! \n After you have your Token and Client ID, you can create your Bot with the `/custombot create` Command.',
                },
                {
                  name: 'Delete',
                  value: 'This will delete your Bot. \n You can delete your Bot with the `/custombot delete` Command.',
                },
                {
                  name: 'How can i make that only i can invite the Bot?',
                  value: 'Go to the Discords Developer Portal Click on your Bot .\n You find this setting under the Bot Section. Be sure to untick it not like in the Foto.: https://cdn.discordapp.com/attachments/1067117356066812036/1185976363757359124/kmce6Lf.png?ex=6591918f&is=657f1c8f&hm=187c4e7b16990aa4b1d6eb9d3d3311cd6f0c9d4583afa5498d6a474905bd96ba&',
                },
                {
                  name: 'How can i edit the Bot?',
                  value: 'To edit the Bot you need to delete it and create a new Bot',
                },
              ],
            },
          ],
        });
        break;
      }
      }

    } catch (error) {
      global.handle.error(client, interaction.guild.id, interaction.user.id, error);
    }
  },
};
