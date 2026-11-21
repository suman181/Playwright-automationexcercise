import type { Page } from '@playwright/test';

export const checkoutLocators = (page: Page) => ({
  deliveryAddress: page.locator('#address_delivery'),
  billingAddress: page.locator('#address_invoice'),
  reviewTable: page.locator('#cart_info'),
  comment: page.locator('textarea[name="message"]'),
  placeOrder: page.locator('a[href="/payment"]'),
});
