import { expect, type Locator, type Page } from '@playwright/test';

export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  protected async navigate(path: string): Promise<void> {
    await this.page.goto(path, { waitUntil: 'domcontentloaded' });
  }

  async expectUrl(pattern: string | RegExp): Promise<void> {
    await expect(this.page).toHaveURL(pattern);
  }

  /** Browser-native (HTML5) validation message of a form control; '' when the value is valid. */
  protected validationMessageOf(field: Locator): Promise<string> {
    return field.evaluate((el) => (el as HTMLInputElement).validationMessage);
  }
}
