const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  structure: new SlashCommandBuilder()
    .setName('faq')
    .setDescription('FAQ about the bot'),
  options: {
    nsfw: false,
    category: 'Info',
    cooldown: 1,
  },
  run: async (client, interaction) => {
    await interaction.deferReply(
      {
        ephemeral: true,
      },
    );

    try {

      const embed = new EmbedBuilder()
        .setTitle('Frequently Asked Questions')
        .addFields([
          { name: 'Why are there random backups?', value: 'This may be because your Server you executed the command enabled Day Backups. Day Backups are backups that are created once every 24 hours. Only visible to the Admins.' },
          { name: 'When are day backups?', value: 'Day backups are created once every 24 hours. They have been enabled by the Admins of the Server.' },
          { name: 'What are the limits?', value: 'There is a limit of 5 day backups per server. Once this limit is reached, the oldest backup will be automatically deleted. If you manually create a backup, theres no limit.' },
          { name: 'How does the AI Mod work?', value: 'The AI Mod is a feature that uses AI to detect toxicity in messages. It is not 100% accurate, but it is very accurate. It is recommended to use this feature in conjunction with a human moderator.' },
          { name: 'Can i setup logging for the AI Mod?', value: 'Yes, you can setup logging for the AI Mod. For setting up the AI Mod Logs you should set a AuditLog Channel using the /auditlog command.' },
        ])
        .setColor('Green');

      await interaction.editReply({ embeds: [embed] });
    }
    catch (error) {
      global.handle.error(client, interaction.guild.id, interaction.user.id, error, interaction);
    }
  },
};