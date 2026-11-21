import { test, expect } from '../../src/fixtures';
import { toAmount } from '../../src/utils/price';

test.describe('Shopping cart', () => {
  test('a new visitor starts with an empty cart',
    { tag: ['@regression', '@cart'] },
    async ({ app }) => {
      await app.cart.goto();
      await app.cart.expectEmpty();
    });

  test('product added from the catalogue appears in the cart with the correct price',
    { tag: ['@smoke', '@cart'] },
    async ({ app }) => {
      await app.products.goto();
      const product = await app.products.addToCart(0);
      await app.products.viewCartFromModal();

      const items = await app.cart.getItems();
      expect(items).toHaveLength(1);
      expect(items[0]).toMatchObject({
        name: product.name,
        unitPrice: toAmount(product.price),
        quantity: 1,
        total: toAmount(product.price),
      });
    });

  test('several different products can be added and each row total is price x quantity',
    { tag: ['@regression', '@cart'] },
    async ({ app }) => {
      await app.products.goto();
      const first = await app.products.addToCart(0);
      await app.products.continueShopping();
      const second = await app.products.addToCart(1);
      await app.products.viewCartFromModal();

      const items = await app.cart.getItems();
      expect(items.map((i) => i.name)).toEqual(expect.arrayContaining([first.name, second.name]));
      expect(items).toHaveLength(2);
      for (const item of items) {
        expect(item.total).toBe(item.unitPrice * item.quantity);
      }
    });

  test('quantity chosen on the product page is reflected in the cart total',
    { tag: ['@regression', '@cart'] },
    async ({ app }) => {
      const quantity = 4;
      await app.products.goto();
      await app.products.openDetails(0);
      const product = await app.productDetails.getSummary();

      await app.productDetails.setQuantity(quantity);
      await app.productDetails.addToCart();
      await app.productDetails.viewCart();

      const [item] = await app.cart.getItems();
      expect(item.name).toBe(product.name);
      expect(item.quantity).toBe(quantity);
      expect(item.total).toBe(toAmount(product.price) * quantity);
    });

  test('removing the only product empties the cart',
    { tag: ['@regression', '@cart'] },
    async ({ app }) => {
      await app.products.goto();
      const product = await app.products.addToCart(0);
      await app.products.viewCartFromModal();

      await app.cart.remove(product.name);

      await app.cart.expectEmpty();
    });

  test('guest is asked to register or log in when proceeding to checkout',
    { tag: ['@regression', '@cart', '@negative'] },
    async ({ app }) => {
      await app.products.goto();
      await app.products.addToCart(0);
      await app.products.viewCartFromModal();

      await app.cart.proceedToCheckout();

      await app.cart.expectGuestLoginPrompt();
      await app.cart.goToLoginFromPrompt();
      await app.login.expectOnLoginPage();
    });
});
