const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { promisify } = require('util');
const emojis = require('../../../functions/functions/emojis');

module.exports = {
  structure: new SlashCommandBuilder()
    .setName('massrole')
    .setDescription('👥・Give a role to every user in the server.')
    .addRoleOption((opt) =>
      opt.setName('role')
        .setDescription('🎭・The role you want to give to every user.')
        .setRequired(true),
    ),
  options: {
    nsfw: false,
    category: 'Utility',
    cooldown: 1,
  },
  /**
   * @param {ExtendedClient} client
   * @param {ChatInputCommandInteraction} interaction
   */
  run: async (client, interaction) => {

    await interaction.deferReply( { ephemeral: true } );

    try {

      if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
        return interaction.editReply({ content: `${emojis.erroricon} You need the \`Adminstrator\` permission to use this command!` });
      }

      const role = interaction.options.getRole('role');

      const members = await interaction.guild.members.fetch();

      for (const member of members.values()) {
        if (!member.roles.cache.has(role.id)) {
          await member.roles.add(role).catch(console.error);
          setTimeout(promisify(setTimeout), 1000);
        }
      }

      await interaction.editReply(`${emojis.checkicon} Role <@&${role.id}> has been given to every user in the server.`);
    } catch (error) {
      global.handle.error(client, interaction.guild.id, interaction.user.id, error, interaction);
    }
  },
};