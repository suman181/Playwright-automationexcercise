import type { Page } from '@playwright/test';

export const headerLocators = (page: Page) => {
  const nav = page.locator('header ul.navbar-nav');
  return {
    home: nav.locator('a[href="/"]'),
    products: nav.locator('a[href="/products"]'),
    cart: nav.locator('a[href="/view_cart"]'),
    login: nav.locator('a[href="/login"]'),
    logout: nav.locator('a[href="/logout"]'),
    deleteAccount: nav.locator('a[href="/delete_account"]'),
    loggedInAs: nav.locator('a', { hasText: 'Logged in as' }),
  };
};
