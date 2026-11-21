import { expect, type Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { productDetailsLocators } from '../locators/productDetails.locators';
import type { ProductSummary } from './ProductsPage';

export class ProductDetailsPage extends BasePage {
  private readonly ui: ReturnType<typeof productDetailsLocators>;

  constructor(page: Page) {
    super(page);
    this.ui = productDetailsLocators(page);
  }

  async getSummary(): Promise<ProductSummary> {
    await expect(this.ui.name).toBeVisible();
    return {
      name: ((await this.ui.name.textContent()) ?? '').trim(),
      price: ((await this.ui.price.textContent()) ?? '').trim(),
    };
  }

  async expectProductInformationVisible() {
    await expect(this.ui.category).toBeVisible();
    await expect(this.ui.availability).toBeVisible();
    await expect(this.ui.condition).toBeVisible();
    await expect(this.ui.brand).toBeVisible();
  }
}
