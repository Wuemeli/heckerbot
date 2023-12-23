const config = require('../../config');
const { log } = require('../../functions/functions/consolelog');
const ExtendedClient = require('../../class/ExtendedClient');
const emojis = require('../../functions/functions/emojis');
const {PermissionFlagsBits} = require('discord.js');
const { hasPremium } = require('../../functions/custom-bot/premium');

const cooldown = new Map();

module.exports = {
  event: 'interactionCreate',
  /**
     *
     * @param {ExtendedClient} client
     * @param {import('discord.js').Interaction} interaction
     * @returns
     */
  run: async (client, interaction) => {
    if (!interaction.isCommand()) return;

    if (
      config.handler.commands.slash === false &&
            interaction.isChatInputCommand()
    ) {
      return;
    }
    if (
      config.handler.commands.user === false &&
            interaction.isUserContextMenuCommand()
    ) {
      return;
    }
    if (
      config.handler.commands.message === false &&
            interaction.isMessageContextMenuCommand()
    ) {
      return;
    }

    const command = client.collection.interactioncommands.get(
      interaction.commandName,
    );

    if (!command) return;

    try {

      if (command.options?.nsfw && !interaction.channel.nsfw) {
        await interaction.reply({
          content: `${emojis.erroricon} This command can only be used in a NSFW channel.`,
          ephemeral: true,
        });

        return;
      }

      if (command.options.premium) {
        if (!process.env.PREMIUM) {
          return interaction.reply({ content: `${emojis.erroricon} Premium System needs to be enabled.`, ephemeral: true });
        }
        const hasUserPremium = await hasPremium(interaction.user.id);
        if (!hasUserPremium) {
          return interaction.reply({
            content: `${emojis.erroricon} You need to have premium to use this command. Click on me and click on "Upgrade" to get premium.`,
            ephemeral: true,
          });
        }
      }
      if (process.env[command.options.category.toUpperCase()] === 'false') {
        return interaction.reply({ content: `${emojis.erroricon} The ${command.options.category} category is currently disabled.`, ephemeral: true });
      }

      if (command.options?.cooldown) {
        const cooldownFunction = () => {
          const data = cooldown.get(interaction.user.id);

          data.push(interaction.commandName);

          cooldown.set(interaction.user.id, data);

          setTimeout(() => {
            let data = cooldown.get(interaction.user.id);

            data = data.filter((v) => v !== interaction.commandName);

            if (data.length <= 0) {
              cooldown.delete(interaction.user.id);
            } else {
              cooldown.set(interaction.user.id, data);
            }
          }, command.options?.cooldown);
        };

        if (cooldown.has(interaction.user.id)) {
          const data = cooldown.get(interaction.user.id);

          if (data.some((v) => v === interaction.commandName)) {
            await interaction.reply({
              content: `${emojis.erroricon} You are on cooldown for this command.`,
              ephemeral: true,
            });

            return;
          } else {
            cooldownFunction();
          }
        } else {
          cooldown.set(interaction.user.id, [interaction.commandName]);

          cooldownFunction();
        }
      }

      command.run(client, interaction);
    } catch (error) {
      log(error, 'err');
    }
  },
};
