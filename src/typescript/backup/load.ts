import type { BackupData, LoadOptions } from './types';
import type { Emoji, ForumChannel, Guild, NewsChannel, Role, Snowflake, StageChannel, VoiceChannel } from 'discord.js';
import { ChannelType, GuildFeature, TextChannel } from 'discord.js';
import { loadCategory, loadChannel, sleep } from './util';
import { codeError } from '../functions/errorHandler';

/**
 * Restores the guild configuration
 */
export const loadConfig = async (guild: Guild, backupData: BackupData): Promise<Guild[]> => {
  const configPromises: Promise<Guild>[] = [];
  try {
    if (backupData.name) {
      configPromises.push(guild.setName(backupData.name));
    }
    if (backupData.iconBase64) {
      configPromises.push(guild.setIcon(Buffer.from(backupData.iconBase64, 'base64')));
    } else if (backupData.iconURL) {
      configPromises.push(guild.setIcon(backupData.iconURL));
    }
    if (backupData.splashBase64) {
      configPromises.push(guild.setSplash(Buffer.from(backupData.splashBase64, 'base64')));
    } else if (backupData.splashURL) {
      configPromises.push(guild.setSplash(backupData.splashURL));
    }
    if (backupData.bannerBase64) {
      configPromises.push(guild.setBanner(Buffer.from(backupData.bannerBase64, 'base64')));
    } else if (backupData.bannerURL) {
      configPromises.push(guild.setBanner(backupData.bannerURL));
    }
    if (backupData.verificationLevel) {
      configPromises.push(guild.setVerificationLevel(backupData.verificationLevel));
    }
    if (backupData.defaultMessageNotifications) {
      configPromises.push(guild.setDefaultMessageNotifications(backupData.defaultMessageNotifications));
    }
    const changeableExplicitLevel = guild.features.includes(GuildFeature.Community);
    if (backupData.explicitContentFilter && changeableExplicitLevel) {
      configPromises.push(guild.setExplicitContentFilter(backupData.explicitContentFilter));
    }
  } catch (error) {
    codeError(error as Error, 'src/typescript/backup/load.ts');
  }
  return Promise.all(configPromises);
};

export const loadRoles = async (guild: Guild, backupData: BackupData): Promise<Role[]> => {
  const roles: Role[] = [];
  const sortedRoles = backupData.roles.sort((a, b) => b.position - a.position);
  for (const roleData of sortedRoles) {
    try {
      let role;
      if (roleData.isEveryone) {
        role = await guild.roles.cache.get(guild.id).edit({
          name: roleData.name,
          color: roleData.color,
          permissions: BigInt(roleData.permissions),
          mentionable: roleData.mentionable
        });
      } else {
        role = await guild.roles.create({
          name: roleData.name,
          color: roleData.color,
          hoist: roleData.hoist,
          permissions: BigInt(roleData.permissions),
          mentionable: roleData.mentionable
        });
      }
      roles.push(role);
      await sleep(1000);
    } catch (error) {
      codeError(error as Error, 'src/typescript/backup/load.ts');
    }
  }
  return roles;
};

/**
 * Restore the guild channels
 */
export const loadChannels = async (guild: Guild, backupData: BackupData, options: LoadOptions): Promise<unknown[]> => {
  const loadChannelPromises: Promise<void | unknown>[] = [];
  try {
    for (const categoryData of backupData.channels.categories) {
      const createdCategory = await loadCategory(categoryData, guild);
      for (const channelData of categoryData.children) {
        loadChannelPromises.push(loadChannel(channelData, guild, createdCategory, options));
      }
    }
    for (const channelData of backupData.channels.others) {
      loadChannelPromises.push(loadChannel(channelData, guild, null, options));
    }
  } catch (error) {
    codeError(error as Error, 'src/typescript/backup/load.ts');
  }
  return Promise.all(loadChannelPromises);
};

/**
 * Restore the afk configuration
 */
export const loadAFK = async (guild: Guild, backupData: BackupData): Promise<Guild[]> => {
  const afkPromises: Promise<Guild>[] = [];
  try {
    if (backupData.afk) {
      afkPromises.push(
        guild.setAFKChannel(
          guild.channels.cache.find(
            (ch) => ch.name === backupData.afk.name && ch.type === ChannelType.GuildVoice
          ) as VoiceChannel
        )
      );
      afkPromises.push(guild.setAFKTimeout(backupData.afk.timeout));
    }
  } catch (error) {
    codeError(error as Error, 'src/typescript/backup/load.ts');
  }
  return Promise.all(afkPromises);
};

/**
 * Restore guild emojis
 */
export const loadEmojis = async (guild: Guild, backupData: BackupData): Promise<Emoji[]> => {
  const emojiPromises: Promise<Emoji>[] = [];
  try {
    backupData.emojis.forEach((emoji) => {
      if (emoji.url) {
        emojiPromises.push(guild.emojis.create({ attachment: emoji.url, name: emoji.name }));
      } else if (emoji.base64) {
        emojiPromises.push(
          guild.emojis.create({ attachment: Buffer.from(emoji.base64, 'base64'), name: emoji.name })
        );
      }
    });
  } catch (error) {
    codeError(error as Error, 'src/typescript/backup/load.ts');
  }
  return Promise.all(emojiPromises);
};

/**
 * Restore guild bans
 */
export const loadBans = async (guild: Guild, backupData: BackupData): Promise<string[]> => {
  const banPromises: Promise<string>[] = [];
  try {
    backupData.bans.forEach((ban) => {
      banPromises.push(
        guild.members.ban(ban.id, {
          reason: ban.reason
        }) as Promise<string>
      );
    });
  } catch (error) {
    codeError(error as Error, 'src/typescript/backup/load.ts');
  }
  return Promise.all(banPromises);
};

/**
 * Restore embedChannel configuration
 */
export const loadEmbedChannel = async (guild: Guild, backupData: BackupData): Promise<Guild[]> => {
  const embedChannelPromises: Promise<Guild>[] = [];
  try {
    if (backupData.widget.channel) {
      embedChannelPromises.push(
        guild.setWidgetSettings({
          enabled: backupData.widget.enabled,
          channel: guild.channels.cache.find((ch) => ch.name === backupData.widget.channel) as
            | TextChannel
            | NewsChannel
            | VoiceChannel
            | StageChannel
            | ForumChannel
            | Snowflake
        })
      );
    }
  } catch (error) {
    codeError(error as Error, 'src/typescript/backup/load.ts');
  }
  return Promise.all(embedChannelPromises);
};