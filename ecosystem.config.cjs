module.exports = {
  apps: [
    {
      name: 'platinauz',
      port: 3003,
      instances: 'max',
      exec_mode: 'cluster',
      script: './.output/server/index.mjs'
    }
  ]
}
