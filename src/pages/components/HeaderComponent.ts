import { expect, type Page } from '@playwright/test';
import { headerLocators } from '../../locators/header.locators';

/** Site-wide navigation bar, shared by every page. */
export class HeaderComponent {
  private readonly ui: ReturnType<typeof headerLocators>;

  constructor(page: Page) {
    this.ui = headerLocators(page);
  }

  async goToLogin() { await this.ui.login.click(); }
  async goToProducts() { await this.ui.products.click(); }
  async logout() { await this.ui.logout.click(); }
  async deleteAccount() { await this.ui.deleteAccount.click(); }

  async expectLoggedInAs(name: string) {
    await expect(this.ui.loggedInAs).toBeVisible();
    await expect(this.ui.loggedInAs).toContainText(name);
  }

  async expectLoggedOut() {
    await expect(this.ui.loggedInAs).toBeHidden();
    await expect(this.ui.login).toBeVisible();
  }
}
