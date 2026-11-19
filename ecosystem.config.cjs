module.exports = {
  apps: [
    {
      name: 'platinauz',
      port: 3003,
      instances: 'max',
      exec_mode: 'cluster',
      script: './.output/server/index.mjs',
      // Listen on localhost only: the host nginx (platina.uz) proxies to
      // 127.0.0.1:3003, and the port must not be reachable from the internet
      // bypassing nginx/TLS (backend ISSUES.md #17). Nitro reads HOST/PORT.
      env: {
        HOST: '127.0.0.1',
        PORT: 3003
      }
    }
  ]
}
