const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  structure: new SlashCommandBuilder()
    .setName('hack')
    .setDescription('👤・Hack other users.')
    .addUserOption((opt) =>
      opt.setName('user')
        .setDescription('👤・The user you want to hack.')
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

    await interaction.deferReply();

    const user = interaction.options.getUser('user');

    try {


      const embed = new EmbedBuilder()
        .setTitle(`${user.username}'s Data`)
        .setColor('Green')
        .setFooter({ text: 'This is a joke, please don\'t take it seriously.' })
        .addFields(
          { name: 'IP', value: 'Hacking...' },
          { name: 'Location', value: 'Hacking...' },
          { name: 'Email', value: 'Hacking...' },
          { name: 'Password', value: 'Hacking...' },
        );

      await interaction.editReply({ embeds: [embed] });

      setTimeout(async () => {
        const embed = new EmbedBuilder()
          .setTitle(`${user.username}'s Data`)
          .setColor('Green')
          .setFooter({ text: 'This is a joke, please don\'t take it seriously.' })
          .addFields(
            { name: 'IP', value: getRandomIP() },
            { name: 'Location', value: getRandomLocation() },
            { name: 'Email', value: getRandomEmail(user.username) },
            { name: 'Password', value: getRandomPassword() },
          );
        await interaction.editReply({ embeds: [embed] });
      }, 5000);

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      global.handle.error(client, interaction.guild.id, interaction.user.id, error, interaction);
    }
  },
};

function getRandomIP() {
  return Array.from({ length: 4 }, () => Math.floor(Math.random() * 256)).join('.');
}

function getRandomLocation() {
  const countries = ['USA', 'Canada', 'UK', 'Germany', 'France', 'Japan', 'Australia'];
  return countries[Math.floor(Math.random() * countries.length)];
}

function getRandomEmail(username) {
  const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'example.com'];
  const randomDomain = domains[Math.floor(Math.random() * domains.length)];
  return `${username}@${randomDomain}`;
}

function getRandomPassword() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+';
  const passwordLength = 12;
  return Array.from({ length: passwordLength }, () => characters.charAt(Math.floor(Math.random() * characters.length))).join('');
}
