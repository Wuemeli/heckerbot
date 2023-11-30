module.exports = {
  apps: [
    {
      name: 'heckerbot',
      script: 'bun production',
      env_hook: {
        command: 'git pull && bun production && pm2 restart heckerbot',
        cwd: process.env.PWD,
      },
    },
  ],
};