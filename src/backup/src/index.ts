import type { BackupData, BackupInfos, CreateOptions, LoadOptions } from './types/';
import type { Guild } from 'discord.js';
import { SnowflakeUtil, IntentsBitField } from 'discord.js';
import { S3Client, GetObjectCommand, PutObjectCommand, DeleteObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import * as createMaster from './create';
import * as loadMaster from './load';
import * as utilMaster from './util';
import nodeFetch from 'node-fetch';
const streamToString = require('stream-to-string');
import { Readable } from 'stream';


const S3 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  },
});

const bucketName = 'backups';

const getBackupData = async (backupID: string) => {
  return new Promise<BackupData>(async (resolve, reject) => {
    try {
      const data = await S3.send(new GetObjectCommand({ Bucket: bucketName, Key: `${backupID}.json` }));
      const bodyStream = new Readable();
      bodyStream.push(await streamToString(data.Body));
      bodyStream.push(null);
      const backupData: BackupData = JSON.parse(await streamToString(bodyStream));
      resolve(backupData);
    } catch (error) {
      console.log(error);
      reject('No backup found');
    }
  });
};

export const fetch = (backupID: string) => {
  return new Promise<BackupInfos>(async (resolve, reject) => {
    getBackupData(backupID)
      .then((backupData) => {
        const backupInfos: BackupInfos = {
          data: backupData,
          id: backupID,
          size: backupData.size
        };
        resolve(backupInfos);
      })
      .catch(() => {
        reject('No backup found');
      });
  });
};

export const create = async (
  guild: Guild,
  options: CreateOptions = {
    backupID: null,
    doNotBackup: [],
    backupMembers: true,
    saveImages: 'url'
  }
) => {
  return new Promise<BackupData>(async (resolve, reject) => {
    const intents = new IntentsBitField(guild.client.options.intents?.toArray() || []);
    if (!intents.has(IntentsBitField.Flags.Guilds)) return reject('Guilds intent is required');

    try {
      const backupData: BackupData = {
        name: guild.name,
        verificationLevel: guild.verificationLevel,
        explicitContentFilter: guild.explicitContentFilter,
        defaultMessageNotifications: guild.defaultMessageNotifications,
        afk: guild.afkChannel ? { name: guild.afkChannel.name, timeout: guild.afkTimeout } : null,
        widget: {
          enabled: guild.widgetEnabled,
          channel: guild.widgetChannel ? guild.widgetChannel.name : null
        },
        channels: { categories: [], others: [] },
        roles: [],
        bans: [],
        emojis: [],
        members: [],
        createdTimestamp: Date.now(),
        guildID: guild.id,
        id: options.backupID ?? SnowflakeUtil.generate().toString(),
        size: 0
      };
      if (guild.iconURL()) {
        if (options && options.saveImages && options.saveImages === 'base64') {
          backupData.iconBase64 = (await nodeFetch(guild.iconURL()).then((res) => res.buffer())).toString(
            'base64'
          );
        }
        backupData.iconURL = guild.iconURL();
      }
      if (guild.splashURL()) {
        if (options && options.saveImages && options.saveImages === 'base64') {
          backupData.splashBase64 = (await nodeFetch(guild.splashURL()).then((res) => res.buffer())).toString(
            'base64'
          );
        }
        backupData.splashURL = guild.splashURL();
      }
      if (guild.bannerURL()) {
        if (options && options.saveImages && options.saveImages === 'base64') {
          backupData.bannerBase64 = (await nodeFetch(guild.bannerURL()).then((res) => res.buffer())).toString(
            'base64'
          );
        }
        backupData.bannerURL = guild.bannerURL();
      }
      if (options && options.backupMembers) {
        backupData.members = await createMaster.getMembers(guild);
      }
      if (!options || !(options.doNotBackup || []).includes('bans')) {
        backupData.bans = await createMaster.getBans(guild);
      }
      if (!options || !(options.doNotBackup || []).includes('roles')) {
        backupData.roles = await createMaster.getRoles(guild);
      }
      if (!options || !(options.doNotBackup || []).includes('emojis')) {
        backupData.emojis = await createMaster.getEmojis(guild, options);
      }
      try {
        backupData.channels = await createMaster.getChannels(guild, options);
      } catch (e) {
        console.log(e);
        return reject('An error occurred');
      }
      console.log('7');
      const backupJSON = JSON.stringify(backupData, null, 4);
      try {
        await S3.send(new PutObjectCommand({ Bucket: bucketName, Key: `${backupData.id}.json`, Body: backupJSON }));
      } catch (error) {
        console.error('Error saving backup:', error);
      }
      resolve(backupData);
    } catch (e) {
      console.log(e);
      reject('An error occurred');
    }
  }
  );
}

export const load = async (
  backup: string | BackupData,
  guild: Guild,
  options: LoadOptions = {}
) => {
  return new Promise(async (resolve, reject) => {
    if (!guild) {
      return reject('Invalid guild');
    }
    try {
      const backupData: BackupData = typeof backup === 'string' ? await getBackupData(backup) : backup;
      try {
        await utilMaster.clearGuild(guild);
        await Promise.all([
          loadMaster.loadConfig(guild, backupData),
          loadMaster.loadRoles(guild, backupData),
          loadMaster.loadChannels(guild, backupData, options),
          loadMaster.loadAFK(guild, backupData),
          loadMaster.loadEmojis(guild, backupData),
          loadMaster.loadBans(guild, backupData), 
          loadMaster.loadEmbedChannel(guild, backupData)
        ]);
      } catch (e) {
        return reject(e);
      }
      return resolve(backupData);
    } catch (e) {
      return reject('No backup found');
    }
  });
};
export const remove = async (backupID: string) => {
  return new Promise<void>(async (resolve, reject) => {
    try {
      await S3.send(new DeleteObjectCommand({ Bucket: bucketName, Key: `${backupID}.json` }));
      resolve();
    } catch (error) {
      reject('Backup not found');
    }
  });
};

export const list = async () => {
  const data = await S3.send(new ListObjectsV2Command({ Bucket: bucketName }));
  return data.Contents.map((item: { Key?: string }) => item.Key ? item.Key.split('.')[0] : '');
}

export default {
  create,
  fetch,
  list,
  load,
  remove
};