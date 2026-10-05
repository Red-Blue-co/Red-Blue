// PM2 process file: `pm2 start ecosystem.config.js` from this folder
module.exports = {
  apps: [
    {
      name: 'red-blue',
      script: 'index.js',
      cwd: __dirname,
      env: { NE_ENV: 'Production' },
      max_memory_restart: '400M',
    },
  ],
};
