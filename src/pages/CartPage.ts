import { expect, type Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { cartLocators } from '../locators/cart.locators';
import { toAmount } from '../utils/price';
import { messages } from '../data/testData';

export interface CartItem {
  name: string;
  unitPrice: number;
  quantity: number;
  total: number;
}

export class CartPage extends BasePage {
  private readonly ui: ReturnType<typeof cartLocators>;

  constructor(page: Page) {
    super(page);
    this.ui = cartLocators(page);
  }

  async goto() { await this.navigate('/view_cart'); }

  async getItems(): Promise<CartItem[]> {
    await expect(this.ui.rows.first()).toBeVisible();
    const items: CartItem[] = [];
    for (let i = 0; i < (await this.ui.rows.count()); i++) {
      const row = this.ui.rows.nth(i);
      items.push({
        name: ((await this.ui.rowName(row).textContent()) ?? '').trim(),
        unitPrice: toAmount((await this.ui.rowPrice(row).textContent()) ?? ''),
        quantity: Number(((await this.ui.rowQuantity(row).textContent()) ?? '').trim()),
        total: toAmount((await this.ui.rowTotal(row).textContent()) ?? ''),
      });
    }
    return items;
  }

  async remove(productName: string) {
    const row = this.ui.rows.filter({ hasText: productName });
    await this.ui.rowRemove(row).click();
    await expect(row).toHaveCount(0);
  }

  async expectEmpty() {
    await expect(this.ui.emptyMessage).toBeVisible();
    await expect(this.ui.emptyMessage).toContainText(messages.emptyCart);
  }

  async proceedToCheckout() { await this.ui.checkoutButton.click(); }

  async expectGuestLoginPrompt() { await expect(this.ui.guestPromptModal).toBeVisible(); }

  async goToLoginFromPrompt() { await this.ui.guestPromptLoginLink.click(); }
}
