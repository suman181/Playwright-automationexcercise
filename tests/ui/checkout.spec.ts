import { test, expect } from '../../src/fixtures';
import { orderComment, paymentCard } from '../../src/data/testData';
import { toAmount } from '../../src/utils/price';

test.describe('Checkout & Payment', () => {
  test('logged-in customer can place an order end to end',
    { tag: ['@smoke', '@checkout', '@e2e'] },
    async ({ app, loggedInUser }) => {
      await app.products.goto();
      const product = await app.products.addToCart(0);
      await app.products.viewCartFromModal();

      const [item] = await app.cart.getItems();
      expect(item.total).toBe(toAmount(product.price));
      await app.cart.proceedToCheckout();

      await app.checkout.expectOnCheckout();
      await app.checkout.expectAddressesMatch(loggedInUser);
      await app.checkout.expectOrderReviewContains([product.name]);
      await app.checkout.addComment(orderComment);
      await app.checkout.placeOrder();

      await app.payment.pay(paymentCard);
      await app.payment.expectOrderPlaced();
    });

  test('guest becomes a customer during checkout and completes the purchase',
    { tag: ['@regression', '@checkout', '@e2e'] },
    async ({ app, newUser }) => {
      // guest builds a cart
      await app.products.goto();
      const product = await app.products.addToCart(0);
      await app.products.viewCartFromModal();
      await app.cart.proceedToCheckout();

      // guest is sent to register
      await app.cart.expectGuestLoginPrompt();
      await app.cart.goToLoginFromPrompt();
      await app.login.startSignup(newUser.name, newUser.email);
      await app.signup.completeRegistration(newUser);
      await app.account.expectCreated();
      await app.account.continue();
      await app.header.expectLoggedInAs(newUser.name);

      // cart survived registration; checkout & pay
      await app.header.goToCart();
      const items = await app.cart.getItems();
      expect(items.map((i) => i.name)).toContain(product.name);
      await app.cart.proceedToCheckout();
      await app.checkout.expectAddressesMatch(newUser);
      await app.checkout.placeOrder();
      await app.payment.pay(paymentCard);

      await app.payment.expectOrderPlaced();
    });

  test('payment is blocked when card details are missing',
    { tag: ['@regression', '@checkout', '@negative'] },
    async ({ app, loggedInUser: _customer }) => {
      await app.products.goto();
      await app.products.addToCart(0);
      await app.products.viewCartFromModal();
      await app.cart.proceedToCheckout();
      await app.checkout.placeOrder();

      await app.payment.submitPayment(); // nothing filled in

      await app.payment.expectOnPayment();
      expect(await app.payment.cardNumberValidationMessage()).not.toBe('');
    });
});
