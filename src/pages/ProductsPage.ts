import { expect, type Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { productsLocators } from '../locators/products.locators';

export interface ProductSummary {
  name: string;
  price: string; // as displayed, e.g. "Rs. 500"
}

export class ProductsPage extends BasePage {
  private readonly ui: ReturnType<typeof productsLocators>;

  constructor(page: Page) {
    super(page);
    this.ui = productsLocators(page);
  }

  async goto() {
    await this.navigate('/products');
    await this.expectHeading('All Products');
    await expect(this.ui.cards.first()).toBeVisible();
  }

  async search(term: string) {
    await this.ui.searchInput.fill(term);
    await this.ui.searchButton.click();
  }

  async expectHeading(text: string) {
    await expect(this.ui.heading).toHaveText(text, { ignoreCase: true });
  }

  async resultCount() { return this.ui.cards.count(); }
  async resultNames() { return (await this.ui.cardNames.allTextContents()).map((n) => n.trim()); }

  async getProduct(index: number): Promise<ProductSummary> {
    const card = this.ui.cards.nth(index);
    await expect(card).toBeVisible();
    return {
      name: ((await this.ui.cardName(card).textContent()) ?? '').trim(),
      price: ((await this.ui.cardPrice(card).textContent()) ?? '').trim(),
    };
  }

  async openDetails(index: number) {
    await this.ui.cardViewDetails(this.ui.cards.nth(index)).click();
    await expect(this.page).toHaveURL(/\/product_details\//);
  }
}
