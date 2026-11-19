import type { Page } from '@playwright/test';

export const loginLocators = (page: Page) => ({
  loginHeading: page.locator('.login-form h2'),

  signupHeading: page.locator('.signup-form h2'),
  signupName: page.getByTestId('signup-name'),
  signupEmail: page.getByTestId('signup-email'),
  signupButton: page.getByTestId('signup-button'),
  signupError: page.locator('.signup-form p'),
});
