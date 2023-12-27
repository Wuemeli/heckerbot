const config = require('../../config');
const { log } = require('../../functions/functions/consolelog');
const ExtendedClient = require('../../class/ExtendedClient');
const emojis = require('../../functions/functions/emojis');
const { hasPremium } = require('../../functions/custom-bot/premium');
const { permissionChecker } = require('../../functions/functions/permissionChecker');

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
      if (!interaction.guild) {
        await interaction.reply({
          content: `${emojis.erroricon} This command can only be used in a server.`,
          ephemeral: true,
        });
      }

      if (!permissionChecker(interaction)) {
        const guildOwner = await interaction.guild.fetchOwner();
        guildOwner.send(
          `${emojis.erroricon} Oh no! I cant work in your server because I dont have the required permissions. Please reinvite me with the correct permissions.`,
        );
        return interaction.reply({
          content: `${emojis.erroricon} I don't have the required permissions to run this command. Please reinvite me with the correct permissions.`,
          ephemeral: true,
        });
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
