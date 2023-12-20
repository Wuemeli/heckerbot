import type {
  BanData,
  CategoryData,
  ChannelsData,
  CreateOptions,
  EmojiData,
  RoleData,
  TextChannelData,
  VoiceChannelData
} from './types';
import type {
  CategoryChannel,
  Collection,
  Guild,
  GuildChannel,
  Snowflake,
  TextChannel,
  ThreadChannel,
  VoiceChannel
} from 'discord.js';
import { ChannelType } from 'discord.js';
import nodeFetch from 'node-fetch';
import { fetchChannelPermissions, fetchTextChannelData, fetchVoiceChannelData } from './util';
import { MemberData } from './types/MemberData';
import { codeError } from '../functions/errorHandler';

/**
 * Returns an array with the banned members of the guild
 * @param {Guild} guild The Discord guild
 * @returns {Promise<BanData[]>} The banned members
 */
export async function getBans(guild: Guild) {
  const bans: BanData[] = [];
  const cases = await guild.bans.fetch(); // Gets the list of the banned members
  cases.forEach((ban) => {
    bans.push({
      id: ban.user.id, // Banned member ID
      reason: ban.reason // Ban reason
    });
  });
  return bans;
}

/**
 * Returns an array with the members of the guild
 * @param {Guild} guild The Discord guild
 * @returns {Promise<MemberData>}
 */

export async function getMembers(guild: Guild) {
  const members: MemberData[] = [];
  guild.members.cache.forEach((member) => {
    members.push({
      userId: member.user.id, // Member ID
      username: member.user.username, // Member username
      discriminator: member.user.discriminator, // Member discriminator
      avatarUrl: member.user.displayAvatarURL(), // Member avatar URL
      joinedTimestamp: member.joinedTimestamp, // Member joined timestamp
      roles: member.roles.cache.map((role) => role.id), // Member roles
      bot: member.user.bot, // Member bot
      tag: member.user.tag, //Member tag
      nickname: member.displayName, //Member nickname
      accentColor: member.user.accentColor //Member banner color
    });
  });
  return members;
}


/**
 * Returns an array with the roles of the guild
 * @param {Guild} guild The discord guild
 * @returns {Promise<RoleData[]>} The roles of the guild
 */
export async function getRoles(guild: Guild) {
  const roles: RoleData[] = [];
  guild.roles.cache
    .filter((role) => !role.managed)
    .sort((a, b) => b.position - a.position)
    .forEach((role) => {
      const roleData = {
        name: role.name,
        color: role.hexColor,
        hoist: role.hoist,
        permissions: role.permissions.bitfield.toString(),
        mentionable: role.mentionable,
        position: role.position,
        isEveryone: role.name === '@everyone'
      };
      roles.push(roleData);
    });
  return roles;
}

/**
 * Returns an array with the emojis of the guild
 * @param {Guild} guild The discord guild
 * @param {CreateOptions} options The backup options
 * @returns {Promise<EmojiData[]>} The emojis of the guild
 */
export async function getEmojis(guild: Guild, options: CreateOptions) {
  const emojis: EmojiData[] = [];
  guild.emojis.cache.forEach(async (emoji) => {
    const eData: EmojiData = {
      name: emoji.name
    };
    if (options.saveImages && options.saveImages === 'base64') {
      eData.base64 = (await nodeFetch(emoji.url).then((res) => res.buffer())).toString('base64');
    } else {
      eData.url = emoji.url;
    }
    emojis.push(eData);
  });
  return emojis;
}

/**
 * Returns an array with the channels of the guild
 * @param {Guild} guild The discord guild
 * @param {CreateOptions} options The backup options
 * @returns {ChannelData[]} The channels of the guild
 */
export async function getChannels(guild: Guild, options: CreateOptions) {
  return new Promise<ChannelsData>(async (resolve) => {
    const channels: ChannelsData = {
      categories: [],
      others: []
    };
    const categories = (
      guild.channels.cache.filter((ch) => ch.type === ChannelType.GuildCategory) as Collection<
        Snowflake,
        CategoryChannel
      >
    )
      .sort((a, b) => a.position - b.position)
      .toJSON() as CategoryChannel[];
    for (const category of categories) {
      const categoryData: CategoryData = {
        name: category.name,
        permissions: fetchChannelPermissions(category),
        children: []
      };
      const children = category.children.cache.sort((a, b) => a.position - b.position).toJSON();
      for (const child of children) {
        if (child.type === ChannelType.GuildText || child.type === ChannelType.GuildAnnouncement) {
          const channelData: TextChannelData = await fetchTextChannelData(child as TextChannel, options);
          categoryData.children.push(channelData);
        } else {
          const channelData: VoiceChannelData = await fetchVoiceChannelData(child as VoiceChannel);
          categoryData.children.push(channelData);
        }
      }
      channels.categories.push(categoryData);
    }
    const others = (
      guild.channels.cache.filter((ch) => {
        return (
          !ch.parent &&
          ch.type !== ChannelType.GuildCategory &&
          ch.type !== ChannelType.AnnouncementThread &&
          ch.type !== ChannelType.PrivateThread &&
          ch.type !== ChannelType.PublicThread
        );
      }) as Collection<Snowflake, Exclude<GuildChannel, ThreadChannel>>
    )
      .sort((a, b) => a.position - b.position)
      .toJSON();
    for (const channel of others) {
      if (channel.type === ChannelType.GuildText || channel.type === ChannelType.GuildAnnouncement) {
        try {
          const channelData: TextChannelData = await fetchTextChannelData(channel as TextChannel, options);
          channels.others.push(channelData);
        } catch (e) {
          codeError(e as Error, 'src/typescript/backup/create.ts');
        }
      } else {
        const channelData: VoiceChannelData = await fetchVoiceChannelData(channel as VoiceChannel);
        channels.others.push(channelData);
      }
    }
    resolve(channels);
  });
}