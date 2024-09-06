import { Client, Interaction } from 'discord.js';
import { Collection } from 'discord.js';
import { log } from '../../functions/functions/consolelog';
import { ExtendedClient } from '../../class/ExtendedClient';
import emojis from '../../functions/functions/emojis';

interface CommandOptions {
  premium?: boolean;
  category?: string;
  cooldown?: number;
}

const cooldown = new Map < string, string[]> ();

export default {
  event: 'interactionCreate',
  /**
    *
    * @param {ExtendedClient} client
    * @param {Interaction} interaction
    * @returns
    */
  run: async (client: ExtendedClient, interaction: Interaction) => {
    if (!interaction.isCommand()) return;

    const command = client.collection.interactioncommands.get(
      interaction.commandName,
    ) as Command | undefined;

    if (!command) return;

    try {
      if (!interaction.guild) {
        await interaction.reply({
          content: `${emojis.erroricon} This command can only be used in a server.`,
          ephemeral: true,
        });
      }

      /*
      if (command.options?.premium) {
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
      */

      if (process.env[command.options.category?.toUpperCase() || ''] === 'false') {
        return interaction.reply({ content: `${emojis.erroricon} The ${command.options.category} category is currently disabled.`, ephemeral: true });
      }

      if (command.options?.cooldown) {
        const cooldownFunction = () => {
          const data = cooldown.get(interaction.user.id);

          data?.push(interaction.commandName);

          cooldown.set(interaction.user.id, data ?? []);

          setTimeout(() => {
            let data = cooldown.get(interaction.user.id);

            data = data?.filter((v) => v !== interaction.commandName);

            if (data && data.length <= 0) {
              cooldown.delete(interaction.user.id);
            } else {
              cooldown.set(interaction.user.id, data ?? []);
            }
          }, command.options.cooldown);
        };

        if (cooldown.has(interaction.user.id)) {
          const data = cooldown.get(interaction.user.id);

          if (data?.some((v) => v === interaction.commandName)) {
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