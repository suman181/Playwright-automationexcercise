import { expect, type Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { loginLocators } from '../locators/login.locators';

export class LoginPage extends BasePage {
  private readonly ui: ReturnType<typeof loginLocators>;

  constructor(page: Page) {
    super(page);
    this.ui = loginLocators(page);
  }

  async goto() {
    await this.navigate('/login');
    await this.expectOnLoginPage();
  }

  async login(email: string, password: string) {
    await this.ui.loginEmail.fill(email);
    await this.ui.loginPassword.fill(password);
    await this.ui.loginButton.click();
  }

  async startSignup(name: string, email: string) {
    await this.ui.signupName.fill(name);
    await this.ui.signupEmail.fill(email);
    await this.ui.signupButton.click();
  }

  async expectOnLoginPage() {
    await expect(this.page).toHaveURL(/\/login/);
    await expect(this.ui.loginHeading).toContainText('Login to your account');
    await expect(this.ui.signupHeading).toContainText('New User Signup!');
  }

  async expectLoginError(message: string) {
    await expect(this.ui.loginError).toHaveText(message);
  }

  async expectSignupError(message: string) {
    await expect(this.ui.signupError).toHaveText(message);
  }

  loginValidationMessage(field: 'email' | 'password') {
    return this.validationMessageOf(field === 'email' ? this.ui.loginEmail : this.ui.loginPassword);
  }

  signupValidationMessage(field: 'name' | 'email') {
    return this.validationMessageOf(field === 'name' ? this.ui.signupName : this.ui.signupEmail);
  }
}
