import type { APIRequestContext } from '@playwright/test';
import { toApiForm, type UserData } from '../data/userFactory';

/** automationexercise.com returns HTTP 200 and puts the "real" status in the body's responseCode. */
export interface ApiResult<T = Record<string, unknown>> {
  httpStatus: number;
  body: { responseCode: number; message?: string } & T;
}

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';

export interface ApiProduct {
  id: number;
  name: string;
  price: string;
  brand: string;
  category: { usertype: { usertype: string }; category: string };
}

/** Thin wrapper over https://automationexercise.com/api_list, used for fast data setup/teardown and API tests. */
export class UserApi {
  constructor(private readonly request: APIRequestContext) {}

  /** Generic call - also used for negative scenarios (unsupported methods, missing params). */
  async call<T = Record<string, unknown>>(
    method: Method,
    path: string,
    form?: Record<string, string>,
  ): Promise<ApiResult<T>> {
    const res = await this.request.fetch(`/api/${path}`, { method, form });
    return { httpStatus: res.status(), body: await res.json() };
  }

  createAccount(user: UserData) { return this.call('POST', 'createAccount', toApiForm(user)); }
  updateAccount(user: UserData) { return this.call('PUT', 'updateAccount', toApiForm(user)); }
  deleteAccount(email: string, password: string) { return this.call('DELETE', 'deleteAccount', { email, password }); }
  verifyLogin(email: string, password: string) { return this.call('POST', 'verifyLogin', { email, password }); }
  getUserByEmail(email: string) {
    return this.call<{ user: { email: string; name: string; first_name: string } }>(
      'GET',
      `getUserDetailByEmail?email=${encodeURIComponent(email)}`,
    );
  }
  getAllProducts() { return this.call<{ products: ApiProduct[] }>('GET', 'productsList'); }
  getAllBrands() { return this.call<{ brands: { id: number; brand: string }[] }>('GET', 'brandsList'); }
  searchProduct(term: string) { return this.call<{ products: ApiProduct[] }>('POST', 'searchProduct', { search_product: term }); }
}
