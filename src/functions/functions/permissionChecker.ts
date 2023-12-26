import { re } from "mathjs";

const { PermissionFlagsBits } = require('discord.js');

const PERMISSIONS = [
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
];

export function permissionChecker(interaction: any, command: any) {

  for (const permission of PERMISSIONS) {
    if (!interaction.member.permissions.has(PermissionFlagsBits[permission])) {
      return false;
    }
  }
  return true;
}