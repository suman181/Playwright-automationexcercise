import { expect, type Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { accountLocators } from '../locators/account.locators';
import { messages } from '../data/testData';

/** "Account Created!" / "Account Deleted!" confirmation screens. */
export class AccountPage extends BasePage {
  private readonly ui: ReturnType<typeof accountLocators>;

  constructor(page: Page) {
    super(page);
    this.ui = accountLocators(page);
  }

  async expectCreated() {
    await expect(this.page).toHaveURL(/account_created/);
    await expect(this.ui.created).toContainText(messages.accountCreated, { ignoreCase: true });
  }

  async continue() { await this.ui.continueButton.click(); }
}
