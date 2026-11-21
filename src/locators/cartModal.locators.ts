import type { Page } from '@playwright/test';

export const cartModalLocators = (page: Page) => ({
  modal: page.locator('#cartModal'),
  continueShopping: page.locator('#cartModal .close-modal'),
  viewCart: page.locator('#cartModal a[href="/view_cart"]'),
});
