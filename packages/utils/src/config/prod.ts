export const prodConf = {
  ENV: 'production',
  PORT: 3000,
  BASE_URL: 'http://127.0.0.1',
  PREFIX: '/api',
  JWT: {
    SECRET: 'clean-auth-prod',
    EXPIRES_IN: '2h',
  }
}
