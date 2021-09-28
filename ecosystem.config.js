module.exports = {
  apps: [{
    name: 'Express App',
    script: 'server.js',
    watch: true,
    autorestart: true,
    instances: "MAX",
    exec_mode: 'cluster',
    max_memory_restart: "1G",
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  },],
};
