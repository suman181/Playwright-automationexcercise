import { test, expect } from '../../src/fixtures';
import { messages } from '../../src/data/testData';

test.describe('Registration', () => {
  test('visitor can register a new account and is logged in afterwards',
    { tag: ['@smoke', '@registration'] },
    async ({ app, newUser }) => {
      await app.home.goto();
      await app.home.expectLoaded();
      await app.header.goToLogin();
      await app.login.startSignup(newUser.name, newUser.email);

      await app.signup.expectAccountInfoStep();
      await app.signup.completeRegistration(newUser);

      await app.account.expectCreated();
      await app.account.continue();
      await app.header.expectLoggedInAs(newUser.name);
    });

  test('registered customer can delete the account and can no longer log in',
    { tag: ['@regression', '@registration'] },
    async ({ app, loggedInUser, api }) => {
      await app.header.deleteAccount();
      await app.account.expectDeleted();
      await app.account.continue();

      const { body } = await api.verifyLogin(loggedInUser.email, loggedInUser.password);
      expect(body.responseCode, 'deleted user must not exist any more').toBe(404);
    });

  test('cannot sign up with an e-mail address that is already registered',
    { tag: ['@regression', '@registration', '@negative'] },
    async ({ app, registeredUser }) => {
      await app.login.goto();
      await app.login.startSignup('Someone Else', registeredUser.email);

      await app.login.expectSignupError(messages.emailExists);
      await app.login.expectOnLoginPage();
    });

  const invalidSignups = [
    { title: 'an empty name', name: '', email: 'valid.user@example.com', invalidField: 'name' as const },
    { title: 'an empty e-mail', name: 'Valid Name', email: '', invalidField: 'email' as const },
    { title: 'a malformed e-mail', name: 'Valid Name', email: 'not-an-email', invalidField: 'email' as const },
  ];

  for (const c of invalidSignups) {
    test(`signup is blocked by form validation for ${c.title}`,
      { tag: ['@regression', '@registration', '@negative'] },
      async ({ app }) => {
        await app.login.goto();
        await app.login.startSignup(c.name, c.email);

        await app.login.expectOnLoginPage(); // no navigation to /signup
        expect(await app.login.signupValidationMessage(c.invalidField)).not.toBe('');
      });
  }
});
