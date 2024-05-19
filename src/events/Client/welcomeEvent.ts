import ExtendedClient from '../../class/ExtendedClient';
import welcomeSchema from '../../schemas/welcomeSchema';

/**
 * Event handler for when a new member joins the guild.
 */
export default {
  event: 'guildMemberAdd',
  once: false,
  /**
   * Handles the event of a new member joining the guild.
   * @param {ExtendedClient} client The extended client instance.
   * @param {GuildMember} member The member who joined the guild.
   */
  run: async (client: ExtendedClient, member: GuildMember) => {
    const data = await welcomeSchema.findOne({
      guildId: member.guild.id,
    });

    if (!data) return;

    const { channelId, welcomeMessage: message, picture, role } = data;
    if (!channelId) return;

    const channel = member.guild.channels.cache.get(channelId);
    if (!channel) return;

    let content = message
      .replace('.user', `<@${member.id}>`)
      .replace('.guild', `${member.guild.name}`)
      .replace('.membercount', `${member.guild.memberCount}`);

    if (role) {
      const roleToAdd = member.guild.roles.cache.get(role);
      if (!roleToAdd) return;

      member.roles.add(roleToAdd);
    }

    await channel.send({
      content: content,
    });
  },
};