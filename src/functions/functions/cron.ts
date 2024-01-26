import cron from 'node-cron';
const editStatsEmbed = require('./statsEmbed').default;
const { checkExpiredPremium } = require('../custom-bot/premium');

export function scheduleJobs(client: any): void {
  editStatsEmbed(client).catch(console.error);
  checkExpiredPremium().catch(console.error);
  cron.schedule('0 0 * * *', () => {
    editStatsEmbed(client).catch(console.error);
  });
  cron.schedule('0 0 * * *', () => {
    checkExpiredPremium().catch(console.error);
  });
}