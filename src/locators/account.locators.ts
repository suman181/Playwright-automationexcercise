import type { Page } from '@playwright/test';

export const accountLocators = (page: Page) => ({
  created: page.getByTestId('account-created'),
  deleted: page.getByTestId('account-deleted'),
  continueButton: page.getByTestId('continue-button'),
});
