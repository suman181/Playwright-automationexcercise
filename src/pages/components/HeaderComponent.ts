import { expect, type Page } from '@playwright/test';
import { headerLocators } from '../../locators/header.locators';

/** Site-wide navigation bar, shared by every page. */
export class HeaderComponent {
  private readonly ui: ReturnType<typeof headerLocators>;

  constructor(page: Page) {
    this.ui = headerLocators(page);
  }

  async goToLogin() { await this.ui.login.click(); }

  async expectLoggedInAs(name: string) {
    await expect(this.ui.loggedInAs).toBeVisible();
    await expect(this.ui.loggedInAs).toContainText(name);
  }
}
