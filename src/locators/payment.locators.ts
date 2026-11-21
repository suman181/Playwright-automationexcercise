import type { Page } from '@playwright/test';

export const paymentLocators = (page: Page) => ({
  nameOnCard: page.getByTestId('name-on-card'),
  cardNumber: page.getByTestId('card-number'),
  cvc: page.getByTestId('cvc'),
  expiryMonth: page.getByTestId('expiry-month'),
  expiryYear: page.getByTestId('expiry-year'),
  payButton: page.getByTestId('pay-button'),
  orderPlaced: page.getByTestId('order-placed'),
  confirmation: page.getByText('Congratulations! Your order has been confirmed!'),
  downloadInvoice: page.getByRole('link', { name: 'Download Invoice' }),
});
