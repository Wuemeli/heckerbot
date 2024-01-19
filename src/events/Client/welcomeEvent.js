const ExtendedClient = require('../../class/ExtendedClient');
const welcomeSchema = require('../../schemas/welcomeSchema');

module.exports = {
  event: 'guildMemberAdd',
  once: false,
  /**
 *
 * @param {ExtendedClient} client
 * @param {Message<true>} message
 * @returns
 */
  run: async (client, member) => {
    const data = await welcomeSchema.findOne({
      guildId: member.guild.id,
    });

    console.log(data);

    if (!data) return;

    const { channelId, message, picture, role } = data;
    if (!channelId) return;

    const channel = member.guild.channels.cache.get(channelId);
    if (!channel) return;

    const content = message

      .replace(/{{user}}/g, `<@${member.id}>`)
      .replace(/{{guild}}/g, `${member.guild.name}`)
      .replace(/{{membercount}}/g, `${member.guild.memberCount}`);

    if (role) {
      const roleToAdd = member.guild.roles.cache.get(role);
      if (!roleToAdd) return;

      member.roles.add(roleToAdd);
    }

    await channel.send({
      content: content, files: [{ attachment: picture, name: `${member.guild.name}.png` }],
    });  },
};

