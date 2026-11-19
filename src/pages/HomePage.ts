import { expect, type Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  constructor(page: Page) { super(page); }

  async goto() { await this.navigate('/'); }

  async expectLoaded() {
    await expect(this.page).toHaveTitle(/Automation Exercise/i);
  }
}
