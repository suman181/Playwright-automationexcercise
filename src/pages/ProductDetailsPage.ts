import { expect, type Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { CartModal } from './components/CartModal';
import { productDetailsLocators } from '../locators/productDetails.locators';
import type { ProductSummary } from './ProductsPage';

export class ProductDetailsPage extends BasePage {
  private readonly ui: ReturnType<typeof productDetailsLocators>;
  readonly cartModal: CartModal;

  constructor(page: Page) {
    super(page);
    this.ui = productDetailsLocators(page);
    this.cartModal = new CartModal(page);
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

  async setQuantity(quantity: number) { await this.ui.quantity.fill(String(quantity)); }

  async addToCart() {
    await this.ui.addToCart.click();
    await this.cartModal.expectVisible();
  }

  async viewCart() { await this.cartModal.viewCart(); }
}
