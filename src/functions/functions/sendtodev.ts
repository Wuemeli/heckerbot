import { EmbedBuilder } from 'discord.js';

const devids = process.env.DEV_IDS.split(',');

export default function sendtodev(client: any, event: string, message: string) {
    const users = devids.map(id => client.users.cache.get(id));

    if (event === 'Error') {
        const errorEmbed = new EmbedBuilder()
            .setTitle('Error')
            .setDescription(message)
            .setColor('Red')
            .setTimestamp()

        users.forEach(user => user.send(errorEmbed));
    } else if (event === 'Backup Create') {
        const backupEmbed = new EmbedBuilder()
            .setTitle('Backup Create')
            .setDescription(message)
            .setColor('Green')
            .setTimestamp()

        users.forEach(user => user.send(backupEmbed));
    } else if (event === 'Daily Backup') {
        const dailyBackupEmbed = new EmbedBuilder()
            .setTitle('Daily Backup Create')
            .setDescription(message)
            .setColor('Green')
            .setTimestamp()

        users.forEach(user => user.send(dailyBackupEmbed));
    } else if (event === 'Ready Change') {
        const readyEmbed = new EmbedBuilder()
            .setTitle('Ready Change')
            .setDescription(message)
            .setColor('Yellow')
            .setTimestamp()

        users.forEach(user => user.send(readyEmbed));
    } else if (event === 'Connection Lost') {
        const connectionLostEmbed = new EmbedBuilder()
            .setTitle('Connection Lost')
            .setDescription(message)
            .setColor('Red')
            .setTimestamp()

        users.forEach(user => user.send(connectionLostEmbed));
    } else if (event === 'Custom Bot Create') {
        const customBotCreateEmbed = new EmbedBuilder()
            .setTitle('Custom Bot Create')
            .setDescription(message)
            .setColor('Green')
            .setTimestamp()

        users.forEach(user => user.send(customBotCreateEmbed));
    } else if (event === 'Custom Bot Delete') {
        const customBotDeleteEmbed = new EmbedBuilder()
            .setTitle('Custom Bot Delete')
            .setDescription(message)
            .setColor('Red')
            .setTimestamp()

        users.forEach(user => user.send(customBotDeleteEmbed));
    }
}




