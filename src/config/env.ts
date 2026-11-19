export const env = {
  baseUrl: process.env.BASE_URL ?? 'https://automationexercise.com',
  isCI: !!process.env.CI,
  defaultPassword: process.env.TEST_USER_PASSWORD ?? 'Passw0rd!Test#1',
};
