import { Client, TextChannel, EmbedBuilder, ChannelType } from 'discord.js';

function handleLogs(client: Client): void {
  const logSchema = require('../../schemas/auditlogSchema');

  async function sendLog(guildId: string, embed: any): Promise<void> {
    try {
      const data = await logSchema.findOne({ guildId: guildId });
      if (!data) return;
      const logChannel = client.channels.cache.get(data.channelId) as TextChannel;

      if (!logChannel) return;
      embed.setTimestamp();

      try {
        logChannel.send({ embeds: [embed] });
      } catch (error) {
        console.error(error);
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function getAuditLogUser(guild: any, type: any) {
    const fetchedLogs = await guild.fetchAuditLogs({
      limit: 1,
      type: type,
    });

    if (!fetchedLogs) return null;
    if (!fetchedLogs.entries.first()) return null;


    return fetchedLogs;
  }

  try {

    client.on('messageDelete', async (message) => {
      if (message.author.bot) return;

      const fetchedLogs = await getAuditLogUser(message.guild, 72);

      const executorId = fetchedLogs.entries.first().executorId;

      const embed = new EmbedBuilder()
        .setTitle('Message Deleted')
        .setColor('Red')
        .setDescription(`
          **Message   Author : ** <@${message.author.id}> - *${message.author.tag}*
          **Channel : ** <#${message.channel.id}> - *${'name' in message.channel ? message.channel.name : 'DMChannel'}*
          **Executor : ** <@${executorId}> *
          **Deleted Message : **\`${message.content.replace(/`/g, '\'')}\`
       `);

      return sendLog(message.guild.id, embed);
    });

    client.on('guildChannelTopicUpdate', (channel, oldTopic, newTopic) => {

      const embed = new EmbedBuilder()
        .setTitle('Topic Updated!')
        .setColor('Green')
        .setDescription(`${channel} Topic changed from **${oldTopic}** to **${newTopic}**`);

      return sendLog(channel.guild.id, embed);

    });

    client.on('guildChannelPermissionsUpdate', (channel, oldPermissions, newPermissions) => {

      const embed = new EmbedBuilder()
        .setTitle('Permission Updated!')
        .setColor('Green')
        .setDescription(channel.name + 's permissions updated!');

      return sendLog(channel.guild.id, embed);

    });

    client.on('unhandledGuildChannelUpdate', (oldChannel, newChannel) => {

      const embed = new EmbedBuilder()
        .setTitle('Channel Updated!')
        .setColor('Green')
        .setDescription('Channel \'' + oldChannel.id + '\' was edited but discord-logs couldn\'t find what was updated...');

      return sendLog(oldChannel.guild.id, embed);

    });

    client.on('guildMemberBoost', (member) => {

      const embed = new EmbedBuilder()
        .setTitle('User Started Boosting!')
        .setColor('Aqua')
        .setDescription(`**${member.user.tag}** has started boosting  ${member.guild.name}!`);
      return sendLog(member.guild.id, embed);

    });

    client.on('guildMemberUnboost', (member) => {

      const embed = new EmbedBuilder()
        .setTitle('User Stopped Boosting!')
        .setColor('Aqua')
        .setDescription(`**${member.user.tag}** has stopped boosting  ${member.guild.name}!`);

      return sendLog(member.guild.id, embed);

    });

    client.on('guildMemberRoleAdd', (member, role) => {

      const embed = new EmbedBuilder()
        .setTitle('User Got Role!')
        .setColor('Green')
        .setDescription(`**${member.user.tag}** got the role \`${role.name}\``);

      return sendLog(member.guild.id, embed);

    });

    client.on('guildMemberRoleRemove', (member, role) => {

      const embed = new EmbedBuilder()
        .setTitle('User Lost Role!')
        .setColor('Red')
        .setDescription(`**${member.user.tag}** lost the role \`${role.name}\``);

      return sendLog(member.guild.id, embed);

    });

    client.on('guildMemberNicknameUpdate', (member, oldNickname, newNickname) => {

      const embed = new EmbedBuilder()
        .setTitle('Nickname Updated')
        .setColor('Green')
        .setDescription(`${member.user.tag} changed nickname from \`${oldNickname}\` to \`${newNickname}\``);

      return sendLog(member.guild.id, embed);

    });

    client.on('guildMemberAdd', (member) => {

      const embed = new EmbedBuilder()
        .setTitle('User Joined')
        .setColor('Green')
        .setDescription(`Member: ${member.user} (\`${member.user.id}\`)\n\`${member.user.tag}\``)
        .setThumbnail(member.displayAvatarURL())

      return sendLog(member.guild.id, embed);

    });

    client.on('guildMemberRemove', (member) => {

      const embed = new EmbedBuilder()
        .setTitle('User Left')
        .setColor('Red')
        .setDescription(`Member: ${member.user} (\`${member.user.id}\`)\n\`${member.user.tag}\``)
        .setThumbnail(member.displayAvatarURL())

      return sendLog(member.guild.id, embed);

    });

    client.on('guildBoostLevelUp', (guild, oldLevel, newLevel) => {

      const embed = new EmbedBuilder()
        .setTitle('Server Boost Level Up')
        .setColor('Aqua')
        .setDescription(`${guild.name} reached the boost level ${newLevel}`);

      return sendLog(guild.id, embed);

    });

    client.on('guildBoostLevelDown', (guild, oldLevel, newLevel) => {

      const embed = new EmbedBuilder()
        .setTitle('Server Boost Level Down')
        .setColor('Aqua')
        .setDescription(`${guild.name} lost a level from ${oldLevel} to ${newLevel}`);

      return sendLog(guild.id, embed);

    });

    client.on('guildBannerAdd', (guild, bannerURL) => {

      const embed = new EmbedBuilder()
        .setTitle('Server Got a new banner')
        .setColor('Green')
        .setImage(bannerURL);

      return sendLog(guild.id, embed);

    });

    client.on('guildAfkChannelAdd', (guild, afkChannel) => {

      const embed = new EmbedBuilder()
        .setTitle('AFK Channel Added')
        .setColor('Green')
        .setDescription(`${guild.name} has a new afk channel ${afkChannel}`);

      return sendLog(guild.id, embed);

    });

    client.on('guildVanityURLAdd', (guild, vanityURL) => {

      const embed = new EmbedBuilder()
        .setTitle('Vanity Link Added')
        .setColor('Green')
        .setDescription(`${guild.name} has a vanity link ${vanityURL}`);

      return sendLog(guild.id, embed);

    });

    client.on('guildVanityURLRemove', (guild, vanityURL) => {

      const embed = new EmbedBuilder()
        .setTitle('Vanity Link Removed')
        .setColor('Red')
        .setDescription(`${guild.name} has removed its vanity URL ${vanityURL}`);

      return sendLog(guild.id, embed);

    });

    client.on('guildVanityURLUpdate', (guild, oldVanityURL, newVanityURL) => {

      const embed = new EmbedBuilder()
        .setTitle('Vanity Link Updated')
        .setColor('Green')
        .setDescription(`${guild.name} has changed its vanity URL from ${oldVanityURL} to ${newVanityURL}!`);

      return sendLog(guild.id, embed);

    });

    client.on('messagePinned', (message) => {

      const embed = new EmbedBuilder()
        .setTitle('Message Pinned')
        .setColor('Grey')
        .setDescription(`${message} has been pinned by ${message.author}`);

      return sendLog(message.guild.id, embed);

    });

    client.on('messageContentEdited', (message, oldContent, newContent) => {

      const embed = new EmbedBuilder()
        .setTitle('Message Edited')
        .setColor('Grey')
        .setDescription(`Message Edited from \`${oldContent}\` to \`${newContent}\` by ${message.author}`);

      return sendLog(message.guild.id, embed);

    });

    client.on('rolePositionUpdate', (role, oldPosition, newPosition) => {

      const embed = new EmbedBuilder()
        .setTitle('Role Position Updated')
        .setColor('Green')
        .setDescription(role.name + ' role was at position ' + oldPosition + ' and now is at position ' + newPosition);

      return sendLog(role.guild.id, embed);

    });

    client.on('rolePermissionsUpdate', (role, oldPermissions, newPermissions) => {

      const embed = new EmbedBuilder()
        .setTitle('Role Permission Updated')
        .setColor('Green')
        .setDescription(role.name + ' had as permissions ' + oldPermissions + ' and now has as permissions ' + newPermissions);

      return sendLog(role.guild.id, embed);

    });

    client.on('roleCreate', (role) => {

      const embed = new EmbedBuilder()
        .setTitle('Role Added')
        .setColor('Red')
        .setDescription(`Role: ${role}\nRolename: ${role.name}\nRoleID: ${role.id}\nHEX Code: ${role.hexColor}\nPosition: ${role.position}`);

      return sendLog(role.guild.id, embed);

    });

    client.on('roleDelete', async (role) => {
      const fetchedLogs = await getAuditLogUser(role.guild, 32);
      const executorId = fetchedLogs.entries.first().executorId;

      const embed = new EmbedBuilder()
        .setTitle('Role Deleted')
        .setColor('Red')
        .setDescription(`Role: ${role}\nRolename: ${role.name}\nRoleID: ${role.id}\nHEX Code: ${role.hexColor}\nPosition: ${role.position}\nBy: <@${executorId}>`);

      return sendLog(role.guild.id, embed);

    });

    client.on('guildBanAdd', async ({ guild, user }) => {
      const fetchedLogs = await getAuditLogUser(guild, 22);
      const executorId = fetchedLogs.entries.first().executorId;

      const embed = new EmbedBuilder()
        .setTitle('User Banned')
        .setColor('Red')
        .setDescription(`User: ${user} (\`${user.id}\`)\n\`${user.tag}\`\nBy: <@${executorId}>`)
        .setThumbnail(user.displayAvatarURL())

      return sendLog(guild.id, embed);

    });

    client.on('guildBanRemove', async ({ guild, user }) => {
      const fetchedLogs = await getAuditLogUser(guild, 22);
      const executorId = fetchedLogs.entries.first().executorId;

      const embed = new EmbedBuilder()
        .setTitle('User Unbanned')
        .setColor('Green')
        .setDescription(`User: ${user} (\`${user.id}\`)\n\`${user.tag}\`\nBy: <@${executorId}>`)
        .setThumbnail(user.displayAvatarURL())

      return sendLog(guild.id, embed);


    });

    client.on('channelCreate', async (channel) => {
      const fetchedLogs = await getAuditLogUser(channel.guild, 11);
      const executorId = fetchedLogs.entries.first().executorId;


      const embed = new EmbedBuilder()
        .setTitle('Channel Created')
        .setColor('Green')
        .setDescription(`${channel.name} has been created. By: <@${executorId}>`);

      return sendLog(channel.guild.id, embed);

    });

    client.on('channelDelete', async (channel) => {
      if (channel.type === ChannelType.DM) return;

      const fetchedLogs = await getAuditLogUser(channel.guild, 12);
      const executorId = fetchedLogs.entries.first().executorId;

      const embed = new EmbedBuilder()
        .setTitle('Channel Deleted')
        .setColor('Red')
        .setDescription(`${'name' in channel ? channel.name : 'DMChannel'} has been deleted. By: <@${executorId}>`);

      return sendLog(channel.guild.id, embed);
    });
  } catch (err) {
    console.error(err);
  }
}

export default handleLogs;