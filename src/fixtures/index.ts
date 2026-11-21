import { test as base, expect } from '@playwright/test';
import { UserApi } from '../api/UserApi';
import { buildUser, type UserData } from '../data/userFactory';
import {
  AccountPage, HeaderComponent, HomePage, LoginPage, ProductDetailsPage, ProductsPage, SignupPage,
} from '../pages';

export interface App {
  header: HeaderComponent;
  home: HomePage;
  login: LoginPage;
  signup: SignupPage;
  account: AccountPage;
  products: ProductsPage;
  productDetails: ProductDetailsPage;
}

interface Fixtures {
  /** All page objects of the application. */
  app: App;
  /** API helper bound to the configured base URL. */
  api: UserApi;
  /** Unique, NOT yet registered user. Removed (best effort) after the test. */
  newUser: UserData;
  /** Unique user pre-created through the API (fast setup). Removed after the test. */
  registeredUser: UserData;
  /** registeredUser that is already logged in through the UI. */
  loggedInUser: UserData;
  /** Auto fixture: aborts third-party ad requests that overlay the site and slow tests down. */
  blockAds: void;
}

const AD_HOSTS = /(googlesyndication|doubleclick|googleadservices|adservice\.google|pagead|adsbygoogle)/;

export const test = base.extend<Fixtures>({
  blockAds: [
    async ({ context }, use) => {
      await context.route(AD_HOSTS, (route) => route.abort());
      await use();
    },
    { auto: true },
  ],

  app: async ({ page }, use) => {
    await use({
      header: new HeaderComponent(page),
      home: new HomePage(page),
      login: new LoginPage(page),
      signup: new SignupPage(page),
      account: new AccountPage(page),
      products: new ProductsPage(page),
      productDetails: new ProductDetailsPage(page),
    });
  },

  api: async ({ request }, use) => {
    await use(new UserApi(request));
  },

  newUser: async ({ api }, use) => {
    const user = buildUser();
    await use(user);
    await api.deleteAccount(user.email, user.password).catch(() => undefined);
  },

  registeredUser: async ({ api }, use) => {
    const user = buildUser();
    const created = await api.createAccount(user);
    expect(created.body.responseCode, 'precondition: user created through API').toBe(201);
    await use(user);
    await api.deleteAccount(user.email, user.password).catch(() => undefined);
  },

  loggedInUser: async ({ app, registeredUser }, use) => {
    await app.login.goto();
    await app.login.login(registeredUser.email, registeredUser.password);
    await app.header.expectLoggedInAs(registeredUser.name);
    await use(registeredUser);
  },
});

export { expect };
