module.exports = {
  apps: [{
    name: 'Heckerbot',
    script: 'bun production',
    env_hook: {
      command: 'bun production',
      cwd: process.env.PWD,
    },
  }],
};