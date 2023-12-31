const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionFlagsBits, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');
const backupSchema = require('../../../schemas/backupSchema');
const backup = require('../../../functions/backup/index.ts');
const emojis = require('../../../functions/functions/emojis');

module.exports = {
  structure: new SlashCommandBuilder()
    .setName('backup')
    .setDescription('📊・Backup commands')
    .addSubcommand(subcommand =>
      subcommand
        .setName('create')
        .setDescription('📊・Create a backup of the server'))
    .addSubcommand(subcommand =>
      subcommand
        .setName('list')
        .setDescription('📊・List all backups of the user'))
    .addSubcommand(subcommand =>
      subcommand
        .setName('load')
        .setDescription('📊・Load a backup of the server')
        .addStringOption(option => option
          .setName('backup-id')
          .setDescription('The ID of the backup')
          .setRequired(true)))
    .addSubcommand(subcommand =>
      subcommand
        .setName('remove')
        .setDescription('📊・Remove a backup')
        .addStringOption(option =>
          option.setName('backup-id')
            .setDescription('The ID of the backup to remove')
            .setRequired(true))),
  options: {
    nsfw: false,
    category: 'Backup',
    cooldown: 1,
  },
  /**
* @param {ExtendedClient} client
* @param {ChatInputCommandInteraction} interaction
*/
  run: async (client, interaction) => {
    try {
      await interaction.deferReply(
        {
          ephemeral: true,
        },
      );
      const subcommand = interaction.options.getSubcommand();

      switch (subcommand) {
      case 'create': {
        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)) {
          return interaction.editReply({ content: `${emojis.erroricon} You need the \`Manage Server\` permission to use this command!`, ephemeral: true });
        }

        backup.create(interaction.guild, {
        }).then((backupData) => {

          new backupSchema({
            userId: interaction.user.id,
            guildId: interaction.guild.id,
            backupId: backupData.id,
          }).save();

          const embed = new EmbedBuilder()
            .setTitle('Backup Created')
            .setDescription('**Backup ID:** ' + backupData.id + '\n**We strongly recommend to dont share this ID with anyone!**')
            .setColor('Green');

          interaction.editReply({ embeds: [embed] });
        },
        );
        break;
      }
      case 'list': {
        const data = await backupSchema.find({ userId: interaction.user.id });
        if (!data) return interaction.editReply({ content: `${emojis.erroricon} You don't have any backups!`, ephemeral: true });

        const backups = [];

        for (const result of data) {
          try {
            await backup.fetch(result.backupId);
            const guild = client.guilds.cache.get(result.guildId);
            const data = `**${result.backupId}** | ${guild.name} (${result.guildId})`;
            backups.push(data);
          } catch (error) {
            await interaction.editReply({ content: `${emojis.erroricon} An error occurred while fetching backup`, ephemeral: true });
          }
        }

        const embed = new EmbedBuilder()
          .setTitle('Backups')
          .setDescription(backups.length > 0 ? backups.join('\n') : 'No backups available')
          .setColor('Green');

        interaction.editReply({ embeds: [embed] });
        break;
      }
      case 'load': {
        const backupId = interaction.options.getString('backup-id');

        const data = await backupSchema.findOne({ backupId: backupId });
        if (!data) return interaction.editReply({ content: `${emojis.erroricon} This Backup don't exists!`, ephemeral: true });

        const row = new ActionRowBuilder()
          .addComponents(
            new ButtonBuilder()
              .setCustomId('confirm-load-backup')
              .setLabel('Confirm')
              .setStyle(ButtonStyle.Success),
          );

        const embed = new EmbedBuilder()
          .setTitle('Confirm Load Backup')
          .setDescription(`This will clear the current server and load the backup **${backupId}**. Do you want to continue?`)
          .setColor('Yellow');

        interaction.editReply({ content: `Backup ID: ${backupId}`, embeds: [embed], components: [row] });
        break;
      }
      case 'remove': {
        const backupId = interaction.options.getString('backup-id');
        const data = await backupSchema.findOne({ userId: interaction.user.id, backupId: backupId });
        if (!data) return interaction.editReply({ content: `${emojis.erroricon} You don't have any backups with that ID!`, ephemeral: true });
        backup.remove(backupId).then(() => {
          const embed = new EmbedBuilder()
            .setTitle('Backup Removed')
            .setDescription('Successfully removed backup!')
            .setColor('Green');

          backupSchema.findOneAndDelete({ backupId: backupId });

          interaction.editReply({ embeds: [embed] });
        });
        break;
      }
      }
    }
    catch (error) {
      global.handle.error(client, interaction.guild.id, interaction.user.id, error, interaction);
    }
  },
};