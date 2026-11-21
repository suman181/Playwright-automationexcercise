import { test, expect } from '../../src/fixtures';
import { messages, searchTerms, unknownSearchTerm } from '../../src/data/testData';

test.describe('Products & Search', () => {
  test('product catalogue lists products with name and price',
    { tag: ['@smoke', '@products'] },
    async ({ app }) => {
      await app.products.goto();

      expect(await app.products.resultCount()).toBeGreaterThan(0);
      const first = await app.products.getProduct(0);
      expect(first.name).not.toBe('');
      expect(first.price).toMatch(/\d+/);
    });

  test('product details page shows the same name and price as the catalogue',
    { tag: ['@regression', '@products'] },
    async ({ app }) => {
      await app.products.goto();
      const listed = await app.products.getProduct(0);

      await app.products.openDetails(0);

      expect(await app.productDetails.getSummary()).toEqual(listed);
      await app.productDetails.expectProductInformationVisible();
    });

  for (const term of searchTerms) {
    test(`searching for "${term}" returns relevant products`,
      { tag: ['@smoke', '@search'] },
      async ({ app }) => {
        await app.products.goto();
        await app.products.search(term);

        await app.products.expectHeading(messages.searchedProducts);
        const names = await app.products.resultNames();
        expect(names.length, `results for "${term}"`).toBeGreaterThan(0);
        expect(
          names.some((n) => n.toLowerCase().includes(term.toLowerCase())),
          `at least one product name contains "${term}"`,
        ).toBe(true);
      });
  }

  test('searching for an unknown product shows no results',
    { tag: ['@regression', '@search', '@negative'] },
    async ({ app }) => {
      await app.products.goto();
      await app.products.search(unknownSearchTerm);

      await app.products.expectHeading(messages.searchedProducts);
      expect(await app.products.resultCount()).toBe(0);
    });
});
