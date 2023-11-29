module.exports = {
  apps: [{
    name: 'Heckerbot',
    script: 'bun production',
    env: {
      githook: {
        command: 'git pull && bun installer && pm2 restart Heckerbot',
      },
    },
  }],
};