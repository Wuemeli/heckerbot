import path from 'path';
import fs from 'fs';

export default {
  head: {
    title: 'Heckerbot',
    meta: [
      { hid: 'description', name: 'description', content: 'Heckerbot is an advanced Discord Bot for your server.' },
      { hid: 'og:title', name: 'og:title', content: 'Heckerbot' },
      { hid: 'og:description', name: 'og:description', content: 'Heckerbot is an advanced Discord Bot for your server.' },
    ],
  },
  css: [
    path.resolve(__dirname, 'assets/css/bootstrap.min.css'),
    path.resolve(__dirname, 'assets/css/style.css'),
  ],
  plugins: fs.readdirSync(path.join(__dirname, 'plugins')).map(file => path.join(__dirname, 'plugins', file)),
};
