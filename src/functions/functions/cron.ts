import cron from 'node-cron';
const { checkExpiredPremium } = require('../custom-bot/premium');

export function scheduleJobs(client: any): void {
  checkExpiredPremium().catch(console.error);
  cron.schedule('0 0 * * *', () => {
    checkExpiredPremium().catch(console.error);
  });
}