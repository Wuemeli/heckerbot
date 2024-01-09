import reminderSchema from '../../schemas/reminderSchema';
import { EmbedBuilder } from 'discord.js';
import backupSchema from '../../schemas/backupSchema';
import backup from '../backup/index';

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

