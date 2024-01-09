import reminderSchema from '../../schemas/reminderSchema';
import { EmbedBuilder } from 'discord.js';
import backupSchema from '../../schemas/backupSchema';
import backup from '../backup/index';
import guildSettings from '../../schemas/guildSchema';

export async function checkReminders(client: any) {
  const reminders = await reminderSchema.find({ time: { $lt: new Date() } });
  for (const reminder of reminders) {
    const user = await client.users.fetch(reminder.userID);

    const embed = new EmbedBuilder()
      .setTitle('Reminder')
      .setDescription(`You wanted me to remind you with: \n**${reminder.message}**`)
      .setColor('Random')
      .setTimestamp();

    await user.send({ embeds: [embed] });
    await reminder.deleteOne({ _id: reminder._id });
  }
  setTimeout(() => checkReminders(client), 1000 * 10);
}

export async function dailyBackup(client: any) {
  const guilds = client.guilds.cache.map((guild: any) => guild.id);

  for (const guildID of guilds) {
    const guild = client.guilds.cache.get(guildID);
    const settings = await guildSettings.findOne({ guildId: guild.id });

    if (settings && settings.dayBackup) {
      const backupData = await backup.create(guild);
      new backupSchema({
        userId: client.user.id,
        guildId: guild.id,
        backupId: backupData.id,
        dayBackup: true,
      }).save();
    }
  }

  setTimeout(() => dailyBackup(client), 1000 * 60 * 60 * 24);
}

export async function clearDailyBackups(client: any) {
 const twoWeeksInMilliseconds = 1000 * 60 * 60 * 24 * 14;
 const now = Date.now();

 const backups = await backupSchema.find({ dayBackup: true });
 for (const backup of backups) {
   if (now - backup.createdAt.getTime() >= twoWeeksInMilliseconds) {
     await backup.remove();
   }
 }

 setTimeout(() => clearDailyBackups(client), twoWeeksInMilliseconds);
}