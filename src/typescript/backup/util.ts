import type {
  CategoryData,
  ChannelPermissionsData,
  CreateOptions,
  LoadOptions,
  TextChannelData,
  ThreadChannelData,
  VoiceChannelData
} from './types';
import type {
  CategoryChannel,
  Guild,
  GuildChannelCreateOptions,
  OverwriteData,
  TextChannel,
  VoiceChannel,
  NewsChannel,
  ThreadChannel,
  Webhook
} from 'discord.js';
import {
  ChannelType,
  OverwriteType,
  GuildDefaultMessageNotifications,
  GuildFeature,
  GuildExplicitContentFilter,
  GuildVerificationLevel,
  GuildSystemChannelFlags
} from 'discord.js';

/**
 * Gets the permissions for a channel
 */
export async function fetchChannelPermissions(channel: TextChannel | VoiceChannel | CategoryChannel | NewsChannel) {
  const permissions: ChannelPermissionsData[] = [];
  channel.permissionOverwrites.cache
    .filter((p) => p.type === OverwriteType.Role)
    .forEach((perm) => {
      // For each overwrites permission
      const role = channel.guild.roles.cache.get(perm.id);
      if (role) {
        permissions.push({
          roleName: role.name,
          allow: perm.allow.bitfield.toString(),
          deny: perm.deny.bitfield.toString()
        });
      }
    });
  return permissions;
}

/**
 * Fetches the voice channel data that is necessary for the backup
 */
export async function fetchVoiceChannelData(channel: VoiceChannel) {
  return new Promise<VoiceChannelData>(async (resolve) => {
    const permissions = await fetchChannelPermissions(channel);
    const channelData: VoiceChannelData = {
      type: ChannelType.GuildVoice,
      name: channel.name,
      bitrate: channel.bitrate,
      userLimit: channel.userLimit,
      parent: channel.parent ? channel.parent.name : null,
      permissions: permissions
    };
    /* Return channel data */
    resolve(channelData);
  });
}

/**
 * Fetches the text channel data that is necessary for the backup
 */
export async function fetchTextChannelData(channel: TextChannel | NewsChannel, options: CreateOptions) {
  return new Promise<TextChannelData>(async (resolve) => {
    const channelData: TextChannelData = {
      type: channel.type,
      name: channel.name,
      nsfw: channel.nsfw,
      rateLimitPerUser: channel.type === ChannelType.GuildText ? channel.rateLimitPerUser : undefined,
      parent: channel.parent ? channel.parent.name : null,
      topic: channel.topic,
      permissions: await fetchChannelPermissions(channel),
      isNews: channel.type === ChannelType.GuildNews,
      threads: []
    };
    /* Fetch channel threads */
    if (channel.threads.cache.size > 0) {
      await Promise.all(
        channel.threads.cache.map(async (thread) => {
          const threadData: ThreadChannelData = {
            type: thread.type,
            name: thread.name,
            archived: thread.archived,
            autoArchiveDuration: thread.autoArchiveDuration,
            locked: thread.locked,
            rateLimitPerUser: thread.rateLimitPerUser,
          };
          try {
            channelData.threads.push(threadData);
          } catch {
            channelData.threads.push(threadData);
          }
        })
      );
    }
    try {
      /* Return channel data */
      resolve(channelData);
    } catch {
      resolve(channelData);
    }
  });
}

/**
 * Creates a category for the guild
 */
export async function loadCategory(categoryData: CategoryData, guild: Guild) {
  return new Promise<CategoryChannel>((resolve) => {
    guild.channels
      .create({
        name: categoryData.name,
        type: ChannelType.GuildCategory
      })
      .then(async (category) => {
        // When the category is created
        const finalPermissions: OverwriteData[] = [];
        if (Array.isArray(categoryData.permissions)) {
          categoryData.permissions.forEach((perm) => {
            const role = guild.roles.cache.find((r) => r.name === perm.roleName);
            if (role) {
              finalPermissions.push({
                id: role.id,
                allow: BigInt(perm.allow),
                deny: BigInt(perm.deny)
              });
            }
          });
        }
        await category.permissionOverwrites.set(finalPermissions);
        resolve(category); // Return the category
      });
  });
}

/**
 * Create a channel and returns it
 */
export async function loadChannel(
  channelData: TextChannelData | VoiceChannelData,
  guild: Guild,
  category?: CategoryChannel,
  options?: LoadOptions
) {
  return new Promise(async (resolve) => {
    const loadMessages = (
      channel: TextChannel | ThreadChannel,
    ): Promise<Webhook | void> => {
      return new Promise(async (resolve) => {
      });
    };

    const createOptions: GuildChannelCreateOptions = {
      name: channelData.name,
      type: null,
      parent: category
    };
    if (channelData.type === ChannelType.GuildText || channelData.type === ChannelType.GuildAnnouncement) {
      createOptions.topic = (channelData as TextChannelData).topic;
      createOptions.nsfw = (channelData as TextChannelData).nsfw;
      createOptions.rateLimitPerUser = (channelData as TextChannelData).rateLimitPerUser;
      createOptions.type =
        (channelData as TextChannelData).isNews && guild.features.includes(GuildFeature.News)
          ? ChannelType.GuildAnnouncement
          : ChannelType.GuildText;
    } else if (channelData.type === ChannelType.GuildVoice) {
      // Downgrade bitrate
      let bitrate = (channelData as VoiceChannelData).bitrate;
      let bitrates = [64000, 128000, 256000, 384000];
      if (bitrate > guild.maximumBitrate) {
        bitrate = bitrates[guild.premiumTier];
      }
      createOptions.bitrate = bitrate;
      createOptions.userLimit = (channelData as VoiceChannelData).userLimit;
      createOptions.type = ChannelType.GuildVoice;
    }
    guild.channels.create(createOptions).then(async (channel) => {
      /* Update channel permissions */
      const finalPermissions: OverwriteData[] = [];
      channelData.permissions.forEach((perm) => {
        const role = guild.roles.cache.find((r) => r.name === perm.roleName);
        if (role) {
          finalPermissions.push({
            id: role.id,
            allow: BigInt(perm.allow),
            deny: BigInt(perm.deny)
          });
        }
      });
      await channel.permissionOverwrites.set(finalPermissions);
      if (channelData.type === ChannelType.GuildText) {
        /* Load threads */
        if ((channelData as TextChannelData).threads.length > 0) {
          //&& guild.features.includes('THREADS_ENABLED')) {
          await Promise.all(
            (channelData as TextChannelData).threads.map(async (threadData) => {
              let autoArchiveDuration = threadData.autoArchiveDuration;
              //if (!guild.features.includes('SEVEN_DAY_THREAD_ARCHIVE') && autoArchiveDuration === 10080) autoArchiveDuration = 4320;
              //if (!guild.features.includes('THREE_DAY_THREAD_ARCHIVE') && autoArchiveDuration === 4320) autoArchiveDuration = 1440;
              return (channel as TextChannel).threads
                .create({
                  name: threadData.name,
                  autoArchiveDuration
                })
            })
          );
        }
        return channel;
      } else {
        resolve(channel); // Return the channel
      }
    });
  });
}

/**
 * Delete all roles, all channels, all emojis, etc... of a guild
 */
export async function clearGuild(guild: Guild) {
  return new Promise<void>(async (resolve, reject) => {
    try {
      // Delete roles
      guild.roles.cache
        .filter((role) => !role.managed && role.editable && role.id !== guild.id)
        .forEach((role) => {
          role.delete().catch(() => { });
        });
      // Delete channels
      guild.channels.cache.forEach((channel) => {
        channel.delete().catch(() => { });
      });
      // Delete emojis
      guild.emojis.cache.forEach((emoji) => {
        emoji.delete().catch(() => { });
      });
      // Fetch and delete webhooks
      const webhooks = await guild.fetchWebhooks();
      webhooks.forEach((webhook) => {
        webhook.delete().catch(() => { });
      });
      // Fetch and unban members
      const bans = await guild.bans.fetch();
      bans.forEach((ban) => {
        guild.members.unban(ban.user).catch(() => { });
      });
      // Reset guild settings
      guild.setAFKChannel(null);
      guild.setAFKTimeout(60 * 5);
      guild.setIcon(null);
      guild.setBanner(null).catch(() => { });
      guild.setSplash(null).catch(() => { });
      guild.setDefaultMessageNotifications(GuildDefaultMessageNotifications.OnlyMentions);
      guild.setWidgetSettings({
        enabled: false,
        channel: null
      });
      if (!guild.features.includes(GuildFeature.Community)) {
        guild.setExplicitContentFilter(GuildExplicitContentFilter.Disabled);
        guild.setVerificationLevel(GuildVerificationLevel.None);
      }
      guild.setSystemChannel(null);
      guild.setSystemChannelFlags([
        GuildSystemChannelFlags.SuppressGuildReminderNotifications,
        GuildSystemChannelFlags.SuppressJoinNotifications,
        GuildSystemChannelFlags.SuppressPremiumSubscriptions
      ]);
      resolve();
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Sleep to avoid rate limits
 * @param ms The time to sleep
  */
export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));