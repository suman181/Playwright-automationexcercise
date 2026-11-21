import { expect, type Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { checkoutLocators } from '../locators/checkout.locators';
import type { UserData } from '../data/userFactory';

export class CheckoutPage extends BasePage {
  private readonly ui: ReturnType<typeof checkoutLocators>;

  constructor(page: Page) {
    super(page);
    this.ui = checkoutLocators(page);
  }

  async expectOnCheckout() { await expect(this.page).toHaveURL(/\/checkout/); }

  /** Delivery AND billing address must reflect the data the customer registered with. */
  async expectAddressesMatch(user: UserData) {
    for (const block of [this.ui.deliveryAddress, this.ui.billingAddress]) {
      await expect(block).toContainText(user.firstName);
      await expect(block).toContainText(user.lastName);
      await expect(block).toContainText(user.address1);
      await expect(block).toContainText(user.city);
      await expect(block).toContainText(user.country);
      await expect(block).toContainText(user.mobile);
    }
  }

  async expectOrderReviewContains(productNames: string[]) {
    for (const name of productNames) {
      await expect(this.ui.reviewTable).toContainText(name);
    }
  }

  async addComment(text: string) { await this.ui.comment.fill(text); }

  async placeOrder() { await this.ui.placeOrder.click(); }
}
