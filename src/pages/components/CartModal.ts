import { expect, type Page } from '@playwright/test';
import { cartModalLocators } from '../../locators/cartModal.locators';

/** "Added!" pop-up shown after adding a product to the cart (product list and details page). */
export class CartModal {
  private readonly ui: ReturnType<typeof cartModalLocators>;

  constructor(page: Page) {
    this.ui = cartModalLocators(page);
  }

  async expectVisible() { await expect(this.ui.modal).toBeVisible(); }

  async continueShopping() {
    await this.ui.continueShopping.click();
    await expect(this.ui.modal).toBeHidden();
  }

  async viewCart() { await this.ui.viewCart.click(); }
}
