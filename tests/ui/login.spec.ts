import { test, expect } from '../../src/fixtures';
import { messages } from '../../src/data/testData';
import { buildUser, type UserData } from '../../src/data/userFactory';

test.describe('Login & Logout', () => {
  test('registered customer can log in and log out',
    { tag: ['@smoke', '@login'] },
    async ({ app, registeredUser }) => {
      await app.login.goto();
      await app.login.login(registeredUser.email, registeredUser.password);
      await app.header.expectLoggedInAs(registeredUser.name);

      await app.header.logout();
      await app.login.expectOnLoginPage();
      await app.header.expectLoggedOut();
    });

  const invalidCredentials: { title: string; credentials: (u: UserData) => { email: string; password: string } }[] = [
    { title: 'a wrong password', credentials: (u) => ({ email: u.email, password: `${u.password}-wrong` }) },
    { title: 'an unregistered e-mail', credentials: () => ({ email: buildUser().email, password: 'Whatever#123' }) },
  ];

  for (const c of invalidCredentials) {
    test(`login is rejected with ${c.title}`,
      { tag: ['@regression', '@login', '@negative'] },
      async ({ app, registeredUser }) => {
        const { email, password } = c.credentials(registeredUser);
        await app.login.goto();
        await app.login.login(email, password);

        await app.login.expectLoginError(messages.invalidLogin);
        await app.header.expectLoggedOut();
      });
  }

  test('login with empty credentials is blocked by form validation',
    { tag: ['@regression', '@login', '@negative'] },
    async ({ app }) => {
      await app.login.goto();
      await app.login.login('', '');

      await app.login.expectOnLoginPage();
      expect(await app.login.loginValidationMessage('email')).not.toBe('');
    });
});
