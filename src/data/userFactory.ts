import { faker } from '@faker-js/faker';
import { env } from '../config/env';

export interface UserData {
  name: string; // signup "username"
  email: string;
  password: string;
  title: 'Mr' | 'Mrs';
  birthDay: string;
  birthMonth: string;
  birthYear: string;
  firstName: string;
  lastName: string;
  company: string;
  address1: string;
  address2: string;
  country: string;
  state: string;
  city: string;
  zipcode: string;
  mobile: string;
}

const letters = (s: string) => s.replace(/[^A-Za-z]/g, '');

/** Builds a unique, valid customer. Unique e-mails make every test independent and parallel-safe. */
export function buildUser(overrides: Partial<UserData> = {}): UserData {
  const firstName = letters(faker.person.firstName());
  const lastName = letters(faker.person.lastName());
  return {
    name: `${firstName}${faker.string.alphanumeric({ length: 4, casing: 'lower' })}`,
    email: `qa.${faker.string.alphanumeric({ length: 12, casing: 'lower' })}@example.com`,
    password: env.defaultPassword,
    title: faker.helpers.arrayElement(['Mr', 'Mrs'] as const),
    birthDay: String(faker.number.int({ min: 1, max: 28 })),
    birthMonth: String(faker.number.int({ min: 1, max: 12 })),
    birthYear: String(faker.number.int({ min: 1960, max: 2002 })),
    firstName,
    lastName,
    company: faker.company.name(),
    address1: faker.location.streetAddress(),
    address2: faker.location.secondaryAddress(),
    country: 'Canada', // must be one of the options of the site's country dropdown
    state: faker.location.state(),
    city: faker.location.city(),
    zipcode: faker.string.numeric(5),
    mobile: faker.string.numeric(10),
    ...overrides,
  };
}

/** Maps UserData to the field names expected by the /api/createAccount endpoint. */
export function toApiForm(u: UserData): Record<string, string> {
  return {
    name: u.name,
    email: u.email,
    password: u.password,
    title: u.title,
    birth_date: u.birthDay,
    birth_month: u.birthMonth,
    birth_year: u.birthYear,
    firstname: u.firstName,
    lastname: u.lastName,
    company: u.company,
    address1: u.address1,
    address2: u.address2,
    country: u.country,
    zipcode: u.zipcode,
    state: u.state,
    city: u.city,
    mobile_number: u.mobile,
  };
}
