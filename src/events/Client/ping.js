const ExtendedClient = require('../../class/ExtendedClient');
const puppeteer = require('puppeteer');

module.exports = {
  event: 'messageCreate',
  once: false,
  /**
   * @param {ExtendedClient} client
   * @param {Message<true>} message
   * @returns
   */
  run: async (client, message) => {
    if (message.mentions.has(client.user.id)) {
      const browser = await puppeteer.launch({ headless: 'new' });
      const page = await browser.newPage();

      await page.goto('https://random-song.com');

      await page.click('#getTrackButton');

      await page.waitForSelector('.track > a'); 

      const songLink = await page.evaluate(() => {
        // eslint-disable-next-line no-undef
        return document.querySelector('.track > a').href;
      });

      await browser.close();

      await message.reply({
        content: `**${message.author.username}**, here's a random song for you: ${songLink}`,
      });
    }
  },
};