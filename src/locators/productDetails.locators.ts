import type { Page } from '@playwright/test';

export const productDetailsLocators = (page: Page) => {
  const info = page.locator('.product-information');
  return {
    name: info.locator('h2'),
    category: info.locator('p', { hasText: 'Category:' }),
    availability: info.locator('p', { hasText: 'Availability:' }),
    condition: info.locator('p', { hasText: 'Condition:' }),
    brand: info.locator('p', { hasText: 'Brand:' }),
    price: info.locator('span span'),
  };
};
