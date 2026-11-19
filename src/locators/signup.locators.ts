import type { Page } from '@playwright/test';

export const signupLocators = (page: Page) => ({
  accountInfoHeading: page.getByText('Enter Account Information'),
  titleMr: page.locator('#id_gender1'),
  titleMrs: page.locator('#id_gender2'),
  password: page.getByTestId('password'),
  day: page.getByTestId('days'),
  month: page.getByTestId('months'),
  year: page.getByTestId('years'),
  newsletter: page.locator('#newsletter'),
  offers: page.locator('#optin'),
  firstName: page.getByTestId('first_name'),
  lastName: page.getByTestId('last_name'),
  company: page.getByTestId('company'),
  address1: page.getByTestId('address'),
  address2: page.getByTestId('address2'),
  country: page.getByTestId('country'),
  state: page.getByTestId('state'),
  city: page.getByTestId('city'),
  zipcode: page.getByTestId('zipcode'),
  mobile: page.getByTestId('mobile_number'),
  createAccount: page.getByTestId('create-account'),
});
