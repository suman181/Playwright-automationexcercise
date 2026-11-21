import type { Locator, Page } from '@playwright/test';

export const cartLocators = (page: Page) => ({
  rows: page.locator('#cart_info_table tbody tr'),
  emptyMessage: page.locator('#empty_cart'),
  checkoutButton: page.locator('.check_out'),
  guestPromptModal: page.locator('#checkoutModal'),
  guestPromptLoginLink: page.locator('#checkoutModal a[href="/login"]'),
  // row-relative helpers
  rowName: (row: Locator) => row.locator('.cart_description h4 a'),
  rowPrice: (row: Locator) => row.locator('.cart_price p'),
  rowQuantity: (row: Locator) => row.locator('.cart_quantity button'),
  rowTotal: (row: Locator) => row.locator('.cart_total_price'),
  rowRemove: (row: Locator) => row.locator('.cart_quantity_delete'),
});
