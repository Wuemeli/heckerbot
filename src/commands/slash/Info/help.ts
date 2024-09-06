import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { Pagination } from 'pagination.djs';

export default {
  structure: new SlashCommandBuilder()
    .setName('help')
    .setDescription('💥・Lists all commands'),
  options: {
    nsfw: false,
    category: 'Info',
    cooldown: 1,
  },
  /**
   * @param {ExtendedClient} client
   * @param {ChatInputCommandInteraction} interaction
   */
  run: async (client, interaction) => {
    await interaction.deferReply();

    try {
      const commands = await client.application.commands.fetch();
      const sortedCommands = commands.sort((a, b) => a.name.localeCompare(b.name));
      const descriptions = sortedCommands.map(command => `</${command.name}:${command.id}> - ${command.description}`);

      const pagination = new Pagination(interaction, { limit: 5 });
      pagination.setDescriptions(descriptions);
      await pagination.render();
    } catch (error) {
      global.handle.error(client, interaction.guild?.id || 'Unknown Guild', interaction.user.id, error, interaction);
    }
  },
};
