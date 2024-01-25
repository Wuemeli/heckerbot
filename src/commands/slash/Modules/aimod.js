const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const aimodschema = require('../../../schemas/aimodSchema');
const emojis = require('../../../functions/functions/emojis');

module.exports = {
  structure: new SlashCommandBuilder()
    .setName('aimod')
    .setDescription('🔨・AI Moderation Settings')
    .addSubcommand(subcommand =>
      subcommand
        .setName('toggle')
        .setDescription('🔨・Toggles AI Moderation'),
    ),
  options: {
    nsfw: false,
    category: 'Auditlog',
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
      if (!interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)) {
        return interaction.editReply({ content: `${emojis.erroricon} You need the \`Manage Server\` permission to use this command!` });
      }

      const guildId = interaction.guild.id;
      const subcommand = interaction.options.getSubcommand();

      if (subcommand === 'toggle') {
        const data = await aimodschema.findOne({ guildId: guildId });

        if (!data) {
          await new aimodschema({
            guildId: guildId,
            toggle: true,
          }).save();

          return interaction.editReply({ content: `${emojis.checkicon} AI Moderation has been enabled!` });
        }

        if (data.toggle === true) {
          await aimodschema.findOneAndUpdate({ guildId: guildId }, {
            toggle: false,
          });

          return interaction.editReply({ content: `${emojis.checkicon} AI Moderation has been disabled!` });
        } else if (data.toggle === false) {
          await aimodschema.findOneAndUpdate({ guildId: guildId }, {
            toggle: true,
          });

          return interaction.editReply({ content: `${emojis.checkicon} AI Moderation has been enabled!` });
        }

        return interaction.editReply({ content: `${emojis.erroricon} Something went wrong!` });

      }
    } catch (error) {
      global.handle.error(client, interaction.guild.id, interaction.user.id, error, interaction);
    }
  },
};