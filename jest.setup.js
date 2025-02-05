// Mock do process.env para testes
process.env = {
  ...process.env,
  NEWS_API_KEY: 'test-api-key',
  CRON_SECRET: 'test-cron-secret',
  PRISMIC_ACCESS_TOKEN: 'test-prismic-token'
};
