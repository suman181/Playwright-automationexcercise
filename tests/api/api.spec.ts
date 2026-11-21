import { test, expect } from '../../src/fixtures';
import { buildUser } from '../../src/data/userFactory';
import { searchTerms } from '../../src/data/testData';

/**
 * Covers the public endpoints listed at https://automationexercise.com/api_list.
 * NOTE: the service always answers HTTP 200 and carries the real status in body.responseCode.
 */
test.describe('API - Products & Brands', () => {
  test('GET productsList returns the product catalogue', { tag: ['@smoke', '@api'] }, async ({ api }) => {
    const { httpStatus, body } = await api.getAllProducts();
    expect(httpStatus).toBe(200);
    expect(body.responseCode).toBe(200);
    expect(body.products.length).toBeGreaterThan(0);
    for (const p of body.products) {
      expect(p).toMatchObject({ id: expect.any(Number), name: expect.any(String), price: expect.stringMatching(/\d/) });
    }
  });

  test('POST productsList is not supported', { tag: ['@regression', '@api', '@negative'] }, async ({ api }) => {
    const { body } = await api.call('POST', 'productsList');
    expect(body.responseCode).toBe(405);
    expect(body.message).toMatch(/not supported/i);
  });

  test('GET brandsList returns brands', { tag: ['@regression', '@api'] }, async ({ api }) => {
    const { body } = await api.getAllBrands();
    expect(body.responseCode).toBe(200);
    expect(body.brands.length).toBeGreaterThan(0);
  });

  test('PUT brandsList is not supported', { tag: ['@regression', '@api', '@negative'] }, async ({ api }) => {
    const { body } = await api.call('PUT', 'brandsList');
    expect(body.responseCode).toBe(405);
  });

  for (const term of searchTerms) {
    test(`POST searchProduct "${term}" returns matching products`, { tag: ['@regression', '@api'] }, async ({ api }) => {
      const { body } = await api.searchProduct(term);
      expect(body.responseCode).toBe(200);
      expect(body.products.length).toBeGreaterThan(0);
    });
  }

  test('POST searchProduct without search_product is a bad request', { tag: ['@regression', '@api', '@negative'] }, async ({ api }) => {
    const { body } = await api.call('POST', 'searchProduct');
    expect(body.responseCode).toBe(400);
    expect(body.message).toMatch(/search_product parameter is missing/i);
  });
});

test.describe('API - User accounts', () => {
  test('create account, read it back, update it and delete it',
    { tag: ['@smoke', '@api'] },
    async ({ api, newUser }) => {
      const created = await api.createAccount(newUser);
      expect(created.body.responseCode).toBe(201);
      expect(created.body.message).toMatch(/user created/i);

      const fetched = await api.getUserByEmail(newUser.email);
      expect(fetched.body.responseCode).toBe(200);
      expect(fetched.body.user.email).toBe(newUser.email);

      const updated = await api.updateAccount({ ...newUser, city: 'Updated City' });
      expect(updated.body.responseCode).toBe(200);
      expect(updated.body.message).toMatch(/user updated/i);

      const deleted = await api.deleteAccount(newUser.email, newUser.password);
      expect(deleted.body.responseCode).toBe(200);
      expect(deleted.body.message).toMatch(/account deleted/i);
    });

  test('creating an account with an existing e-mail is rejected',
    { tag: ['@regression', '@api', '@negative'] },
    async ({ api, registeredUser }) => {
      const { body } = await api.createAccount(registeredUser);
      expect(body.responseCode).toBe(400);
      expect(body.message).toMatch(/already exists/i);
    });

  test('verifyLogin accepts valid credentials', { tag: ['@regression', '@api'] }, async ({ api, registeredUser }) => {
    const { body } = await api.verifyLogin(registeredUser.email, registeredUser.password);
    expect(body.responseCode).toBe(200);
    expect(body.message).toMatch(/user exists/i);
  });

  test('verifyLogin rejects invalid credentials', { tag: ['@regression', '@api', '@negative'] }, async ({ api }) => {
    const ghost = buildUser();
    const { body } = await api.verifyLogin(ghost.email, ghost.password);
    expect(body.responseCode).toBe(404);
    expect(body.message).toMatch(/user not found/i);
  });

  test('verifyLogin without e-mail is a bad request', { tag: ['@regression', '@api', '@negative'] }, async ({ api }) => {
    const { body } = await api.call('POST', 'verifyLogin', { password: 'x' });
    expect(body.responseCode).toBe(400);
  });

  test('DELETE verifyLogin is not supported', { tag: ['@regression', '@api', '@negative'] }, async ({ api }) => {
    const { body } = await api.call('DELETE', 'verifyLogin');
    expect(body.responseCode).toBe(405);
  });
});
