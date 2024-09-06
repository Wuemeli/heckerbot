import { SlashCommandBuilder } from '@discordjs/builders';
import { EmbedBuilder, PermissionFlagsBits, ButtonBuilder, ActionRowBuilder, ButtonStyle, ChatInputCommandInteraction } from 'discord.js';
import backupSchema from '../../../schemas/backupSchema';
import backup from '../../../functions/backup/index';
import emojis from '../../../functions/functions/emojis';
import guildsettingsSchema from '../../../schemas/guildSchema';

interface BackupSchema {
  userId: string;
  guildId: string;
  backupId: string;
}

interface GuildSettingsSchema {
  guildId: string;
  dayBackup: boolean;
}

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
        .addStringOption(option =>
          option
            .setName('backup-id')
            .setDescription('The ID of the backup')
            .setRequired(true)))
    .addSubcommand(subcommand =>
      subcommand
        .setName('autobackup')
        .setDescription('📊・Backups your Server Daily'))
    .addSubcommand(subcommand =>
      subcommand
        .setName('remove')
        .setDescription('📊・Remove a backup')
        .addStringOption(option =>
          option
            .setName('backup-id')
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
      await interaction.deferReply({ ephemeral: true });

      const subcommand = interaction.options.getSubcommand();

      switch (subcommand) {
        case 'create': {
          if (!interaction.member?.permissions.has(PermissionFlagsBits.ManageGuild)) {
            return interaction.editReply({ content: `${emojis.erroricon} You need the \`Manage Server\` permission to use this command!` });
          }

          const backupData = await backup.create(interaction.guild!);
          if (!backupData) return;

          await new backupSchema({
            userId: interaction.user.id,
            guildId: interaction.guild.id,
            backupId: backupData.id,
          }).save();

          const embed = new EmbedBuilder()
            .setTitle('Backup Created')
            .setDescription(`**Backup ID:** ${backupData.id}\n**We strongly recommend not to share this ID with anyone!**`)
            .setColor('Green');

          interaction.editReply({ embeds: [embed] });
          break;
        }
        case 'list': {
          const data = await backupSchema.find({ userId: interaction.user.id });
          if (!data || data.length === 0) {
            return interaction.editReply({ content: `${emojis.erroricon} You don't have any backups!` });
          }

          const backups: string[] = [];

          for (const result of data) {
            try {
              await backup.fetch(result.backupId);
              const guild = client.guilds.cache.get(result.guildId);
              if (guild) {
                const data = `**${result.backupId}** | ${guild.name} (${result.guildId})`;
                backups.push(data);
              }
            } catch (error) {
              await interaction.editReply({ content: `${emojis.erroricon} An error occurred while fetching backup` });
            }
          }

          if (interaction.member?.permissions.has(PermissionFlagsBits.Administrator)) {
            const adminBackups = await backupSchema.find({ guildId: interaction.guild.id, dayBackup: true, userId: null });
            for (const backup of adminBackups) {
              const data = `**${backup.backupId}** | ${interaction.guild.name} (${backup.guildId})`;
              backups.push(data);
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
          if (!interaction.member?.permissions.has(PermissionFlagsBits.Administrator)) {
            return interaction.editReply({ content: `${emojis.erroricon} You need the \`Administrator\` permission to use this command!` });
          }

          const backupId = interaction.options.getString('backup-id', true);

          const data = await backupSchema.findOne({ backupId });
          if (!data) {
            return interaction.editReply({ content: `${emojis.erroricon} This Backup doesn't exist!` });
          }

          const row = new ActionRowBuilder<ButtonBuilder>()
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
        case 'autobackup': {
          if (!interaction.member?.permissions.has(PermissionFlagsBits.Administrator)) {
            return interaction.editReply({ content: `${emojis.erroricon} You need the \`Administrator\` permission to use this command!` });
          }

          const guildId = interaction.guild.id;

          const data = await guildsettingsSchema.findOne({ guildId });
          if (!data) {
            await new guildsettingsSchema({
              guildId,
              dayBackup: true,
            }).save();
            return interaction.editReply({ content: `${emojis.checkicon} Auto backup enabled successfully!` });
          }

          if (data.dayBackup) {
            await guildsettingsSchema.findOneAndUpdate({ guildId }, { dayBackup: false });
            return interaction.editReply({ content: `${emojis.checkicon} Auto backup disabled successfully!` });
          } else {
            await guildsettingsSchema.findOneAndUpdate({ guildId }, { dayBackup: true });
            return interaction.editReply({ content: `${emojis.checkicon} Auto backup enabled successfully!` });
          }
        }
        case 'remove': {
          const backupId = interaction.options.getString('backup-id', true);
          const data = await backupSchema.findOne({ userId: interaction.user.id, backupId });
          if (!data) {
            return interaction.editReply({ content: `${emojis.erroricon} You don't have any backups with that ID!` });
          }

          await backup.remove(backupId);

          await backupSchema.findOneAndDelete({ backupId });

          const embed = new EmbedBuilder()
            .setTitle('Backup Removed')
            .setDescription('Successfully removed backup!')
            .setColor('Green');

          interaction.editReply({ embeds: [embed] });
          break;
        }
      }
    } catch (error) {
      global.handle.error(client, interaction.guild?.id || 'Unknown Guild', interaction.user.id, error, interaction);
    }
  },
};
