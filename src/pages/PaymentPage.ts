import { expect, type Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { paymentLocators } from '../locators/payment.locators';
import { messages, type paymentCard } from '../data/testData';

type Card = typeof paymentCard;

export class PaymentPage extends BasePage {
  private readonly ui: ReturnType<typeof paymentLocators>;

  constructor(page: Page) {
    super(page);
    this.ui = paymentLocators(page);
  }

  async fillCard(card: Card) {
    await this.ui.nameOnCard.fill(card.nameOnCard);
    await this.ui.cardNumber.fill(card.number);
    await this.ui.cvc.fill(card.cvc);
    await this.ui.expiryMonth.fill(card.expiryMonth);
    await this.ui.expiryYear.fill(card.expiryYear);
  }

  async submitPayment() { await this.ui.payButton.click(); }

  async pay(card: Card) {
    await this.fillCard(card);
    await this.submitPayment();
  }

  async expectOnPayment() { await expect(this.page).toHaveURL(/\/payment$/); }

  async expectOrderPlaced() {
    await expect(this.page).toHaveURL(/payment_done/);
    await expect(this.ui.orderPlaced).toContainText(messages.orderPlaced, { ignoreCase: true });
    await expect(this.ui.confirmation).toBeVisible();
    await expect(this.ui.downloadInvoice).toBeVisible();
  }

  cardNumberValidationMessage() { return this.validationMessageOf(this.ui.cardNumber); }
}
