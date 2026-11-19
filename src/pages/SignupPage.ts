import { expect, type Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { signupLocators } from '../locators/signup.locators';
import type { UserData } from '../data/userFactory';

export class SignupPage extends BasePage {
  private readonly ui: ReturnType<typeof signupLocators>;

  constructor(page: Page) {
    super(page);
    this.ui = signupLocators(page);
  }

  async expectAccountInfoStep() {
    await expect(this.page).toHaveURL(/\/signup/);
    await expect(this.ui.accountInfoHeading).toBeVisible();
  }

  async fillAccountInformation(user: UserData) {
    await (user.title === 'Mr' ? this.ui.titleMr : this.ui.titleMrs).check();
    await this.ui.password.fill(user.password);
    await this.ui.day.selectOption(user.birthDay);
    await this.ui.month.selectOption(user.birthMonth);
    await this.ui.year.selectOption(user.birthYear);
    await this.ui.newsletter.check();
    await this.ui.offers.check();
    await this.ui.firstName.fill(user.firstName);
    await this.ui.lastName.fill(user.lastName);
    await this.ui.company.fill(user.company);
    await this.ui.address1.fill(user.address1);
    await this.ui.address2.fill(user.address2);
    await this.ui.country.selectOption(user.country);
    await this.ui.state.fill(user.state);
    await this.ui.city.fill(user.city);
    await this.ui.zipcode.fill(user.zipcode);
    await this.ui.mobile.fill(user.mobile);
  }

  async submit() { await this.ui.createAccount.click(); }

  async completeRegistration(user: UserData) {
    await this.fillAccountInformation(user);
    await this.submit();
  }
}
