import type { Page } from '@playwright/test';

export const headerLocators = (page: Page) => {
  const nav = page.locator('header ul.navbar-nav');
  return {
    home: nav.locator('a[href="/"]'),
    login: nav.locator('a[href="/login"]'),
    loggedInAs: nav.locator('a', { hasText: 'Logged in as' }),
  };
};
