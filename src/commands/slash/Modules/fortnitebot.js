const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { CommandInteraction } = require('discord.js');
const fnbotSchema = require('../../../schemas/fnbotSchema');
const { createBot, startBot, check } = require('../../../functions/fn');
const emojis = require('../../../functions/emojis');
const ExtendedClient = require('../../../class/ExtendedClient');

module.exports = {
  structure: new SlashCommandBuilder()
    .setName('fortnite-bot')
    .setDescription('🤖 Fortnite Bot')
    .addSubcommand(subcommand =>
      subcommand
        .setName('create')
        .setDescription('🚧 Create a Fortnite Bot'),
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('start')
        .setDescription('🟢 Start your Fortnite Bot'),
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('info')
        .setDescription('🔄 Get info about your Fortnite Bot'),
    ),
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
        const data = await fnbotSchema.findOne({
          ownerId: userId,
        });

        if (data) {
          return interaction.editReply({
            embeds: [
              new EmbedBuilder()
                .setTitle('Fortnite Bot')
                .setDescription('You already have a Fortnite Bot!')
                .setColor('Red')
                .setTimestamp(),
            ],
          });
        }

        const authcode = interaction.options.getString('authcode');
        const status = interaction.options.getString('status');
        const platform = interaction.options.getString('platform');
        const cid = interaction.options.getString('cid');
        const bid = interaction.options.getString('bid');
        const pid = interaction.options.getString('pid');
        const lvl = interaction.options.getInteger('lvl');
        const banner = interaction.options.getString('banner');
        const bannercolor = interaction.options.getString('bannercolor');

        await createBot(userId, authcode, status, platform, cid, bid, pid, lvl, banner, bannercolor);

        return interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setTitle('Fortnite Bot')
              .setDescription('Successfully created your Fortnite Bot and it is now online!')
              .setColor('Green')
              .setTimestamp(),
          ],
        });
      }
      case 'start': {
        const data = await fnbotSchema.findOne({
          ownerId: userId,
        });

        if (!data) {
          return interaction.editReply({
            embeds: [
              new EmbedBuilder()
                .setTitle('Fortnite Bot')
                .setDescription('You don\'t have a Fortnite Bot!')
                .setColor('Red')
                .setTimestamp(),
            ],
          });
        }

        await startBot(data.botId);

        return interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setTitle('Fortnite Bot')
              .setDescription('Successfully started your Fortnite Bot!')
              .setColor('Green')
              .setTimestamp(),
          ],
        });
      }

      case 'info': {
        const data = await fnbotSchema.findOne({
          ownerId: userId,
        });

        if (!data) {
          return interaction.editReply({
            embeds: [
              new EmbedBuilder()
                .setTitle('Fortnite Bot')
                .setDescription('You don\'t have a Fortnite Bot!')
                .setColor('Red')
                .setTimestamp(),
            ],
          });
        }

        const client = await ExtendedClient.get(data.botId);

        return interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setTitle('Fortnite Bot')
              .setDescription(`**Status:** ${client.status}\n**Platform:** ${client.platform}\n**CID:** ${client.cid}\n**BID:** ${client.bid}\n**PID:** ${client.pid}\n**Level:** ${client.lvl}\n**Banner:** ${client.banner}\n**Banner Color:** ${client.bannercolor}`)
              .setColor('Green')
              .setTimestamp(),
          ],
        });
      }
      }
    } catch (err) {
      global.handle.error(client, interaction, err);
    }
  },
};
