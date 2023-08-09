module.exports = {
  apps : [{
    interpreter: './node_modules/.bin/ts-node',
    interpreter_args: '-r tsconfig-paths/register',
    watch: true,
    kill_timeout: 10000,
    "listen-timeout": 3000,
    cwd: './',
    name: 'node-main',
    script: './src/app.ts',
    // wait_ready: true,
    max_memory_restart: '500M',
    // watch: false,
    // watch: ['server'],
    ignore_watch: ['node_modules'],
    watch_options: {
      "usePolling": true
    },
    env: {
      PM2_ENV: "PPWQ"
    },
    env_development: {
      PM2_NODE_ENV: "env_development",
    },
    exec_mode : 'cluster',        // Allows your app to be clustered
    instances : 1,          
  }],

  // deploy : {
  //   production : {
  //     user : 'SSH_USERNAME',
  //     host : 'SSH_HOSTMACHINE',
  //     ref  : 'origin/master',
  //     repo : 'GIT_REPOSITORY',
  //     path : 'DESTINATION_PATH',
  //     'pre-deploy-local': '',
  //     'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production',
  //     'pre-setup': ''
  //   }
  // }
};
