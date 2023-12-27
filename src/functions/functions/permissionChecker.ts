import { Permissions } from 'discord.js';

//This is just a array of the perms. Dont gets used
const PERMISSIONS = [
  'BanMembers',
  'ChangeNickname',
  'CreateInstantInvite',
  'ManageChannels',
  'ManageEmojisAndStickers',
  'ManageGuild',
  'ManageNicknames',
  'ManageRoles',
  'ManageWebhooks',
  'ViewAuditLog',
  'ViewGuildInsights',
  'AddReactions',
  'AttachFiles',
  'EmbedLinks',
  'ManageMessages',
  'MentionEveryone',
  'ReadMessageHistory',
  'SendMessages',
  'UseApplicationCommands',
  'UseExternalEmojis',
  'CreatePrivateThreads',
  'CreatePublicThreads',
  'ManageThreads',
  'SendMessagesInThreads',
  'SendTTSMessages',
  'UseExternalStickers',
  'CreateEvents',
  'ManageEvents',
  'ModerateMembers',
  'ViewCreatorMonetizationInsights',
  'SendVoiceMessage'
];

export function permissionChecker(interaction: any) {
  if (interaction.commandName === 'invite') { return true; }
  if (interaction.commandName === 'help') { return true; }

  if (interaction.guild.members.me.permissions.bitfield !== 100600952913141n) {
    return false;
  }
  return true;
}